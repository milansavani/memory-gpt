import express from 'express';
import logger from 'morgan';
import bp from 'body-parser';
import cors from 'cors';

import config from './config/index.js';
import APIError from './helpers/APIError.js';
import http from 'http';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import path from 'path';

import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app)
const wss = new WebSocketServer({ server });

if (config.env === 'development') {
  app.use(logger('dev'));
}

// parse body params and attache them to req.body
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// mount all routes on / path
// app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
// app.use((err, req, res, next) => {
//   if (err instanceof ValidationError) {
//     // validation error contains details object which has error message attached to error property.
//     const allErrors = err.details.map((pathErrors) => Object.values(pathErrors).join(', '));
//     const unifiedErrorMessage = allErrors.join(', ').replace(/, ([^,]*)$/, ' and $1');
//     const error = new APIError(unifiedErrorMessage, err.statusCode);
//     return next(error);
//   }
//   if (!(err instanceof APIError)) {
//     const apiError = new APIError(err.message, err.status);
//     return next(apiError);
//   }
//   return next(err);
// });

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new APIError('API Not Found', httpStatus.NOT_FOUND);
  return next(err);
});

// error handler, send stacktrace only during development
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) =>
  res.status(err.status).json({ // eslint-disable-line implicit-arrow-linebreak
    message: err.isPublic ? err.message : httpStatus[err.status],
    stack: config.env === 'development' ? err.stack : {},
  }));

let pythonScript;

wss.on('connection', (ws) => {
  console.log('a user connected');

  ws.on('message', (data) => {
    const {inputData} = JSON.parse(data.toString())
    if (inputData && pythonScript) {
      pythonScript.stdin.write(inputData + '\n');
    }
  });

  ws.on('disconnect', () => {
    console.log('user disconnected');
    if (pythonScript) {
      pythonScript.stdin.write('exit\n');
    }
  });

  runPythonScript(ws);
});

const runPythonScript = (ws) => {
  let pyScriptFile = path.join(__dirname, '..', '/py_script/main.py')
  pythonScript = spawn('python', [pyScriptFile]);

  // Collect output from the Python script
  pythonScript.stdout.on('data', (data) => {
    const result = data.toString();
    const updatedResult = result.replace('You:', '').trim();
    
    // Send result to the connected clients
    ws.send(JSON.stringify({ data: updatedResult }));
  });

  // Handle errors (if any) from the Python script
  pythonScript.stderr.on('data', (data) => {
    console.error(`Error from Python Script: ${data}`);
  });

  // Handle script completion
  pythonScript.on('close', (code) => {
    console.log(`Python Script exited with code ${code}`);
  });
};
  

export default server;
