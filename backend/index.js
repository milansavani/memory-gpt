// eslint-disable-next-line import/extensions
import config from './src/config/index.js';
import server from './src/server.js';

// listen on port config.port
server.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started on port ${config.port} (${config.env})`);
});

export default server;
