import { spawn } from 'child_process';
import { EventEmitter } from 'events';
import config from './config/index.js';

class PythonScriptManager extends EventEmitter {
  constructor(userId, scriptPath) {
    super();
    this.userId = userId;
    this.pythonScript = spawn(config.PY_CMD, [scriptPath]);

    this.pythonScript.stdout.on('data', (data) => {
      const output = data.toString().trim();
      this.emit('output', output);
    });

    this.pythonScript.stderr.on('data', (data) => {
      this.emit('error', data.toString());
    });

    this.pythonScript.on('close', (code) => {
      this.emit('exit', code);
    });
  }

  sendToScript(message) {
    this.pythonScript.stdin.write(`${message}\n`);
  }

  killScript() {
    this.pythonScript.kill();
  }
}

// eslint-disable-next-line max-len
const createPythonScriptManager = (userId, scriptPath) => new PythonScriptManager(userId, scriptPath);
export default createPythonScriptManager;
