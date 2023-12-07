import express from 'express';
import logger from 'morgan';
import bp from 'body-parser';
import cors from 'cors';
import config from './config/index.js';
import APIError from './helpers/APIError.js';
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import { WebSocketServer } from 'ws';
import createPythonScriptManager from './PythonScriptManager.js';
import httpStatus from 'http-status';

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

app.get('/health-check', (req, res) => res.send('OK'));

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

const connections = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.url.split('/').pop();
  let pyScriptFile = path.join(__dirname, '..', '/py_script/main.py')
  const pythonScriptManager = createPythonScriptManager(userId, pyScriptFile);

  // Store the WebSocket connection
  connections.set(userId, { ws, userId, pythonScriptManager });

  console.log(`User ${userId} connected`);
  
  ws.on('message', (data) => {
    const { inputData } = JSON.parse(data.toString().trim())
    console.log(`Received message from user ${userId}: ${inputData}`);
    
    pythonScriptManager.sendToScript(inputData);
  });

  ws.on('close', () => {
    // Close the associated Python script
    pythonScriptManager.killScript();
    // pythonScript.kill();
  });


  // pythonScript handles
  // Handle script output
  pythonScriptManager.on('output', (data) => {
    const updatedResult = data.replace('You:', '').trim();
    console.log(`Output from Python script for user ${userId}: ${updatedResult}`);
    
    // Broadcast the output to all connected users
    broadcast(userId, updatedResult);
  });

  // Handle errors (if any) from the Python script
  pythonScriptManager.on('error', (error) => {
    console.error(`Error from Python script for user ${userId}: ${error}`);
  });
  
   // Handle script completion
   pythonScriptManager.on('exit', (code) => {
    console.log(`Python script for user ${userId} exited with code ${code}`);
    connections.delete(userId);
    console.log(`User ${userId} disconnected`);
   });
  
});

const broadcast = (senderUserId, message) => {
  // Broadcast the message to all connected users except the sender
  connections.forEach(({ ws, userId }) => {
    if (userId === senderUserId && ws.readyState === 1) { // 1 mean WebSocket.OPEN
      ws.send(JSON.stringify({ data: message }));
    }
  });
};  

export default server;
