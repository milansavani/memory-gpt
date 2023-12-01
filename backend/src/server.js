import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { spawn } from 'child_process';

import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(4001, () => {
  console.log('listening on *:4001');
});