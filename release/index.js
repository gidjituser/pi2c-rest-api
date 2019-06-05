#!/usr/bin/env node
"use strict";

var http = _interopRequireWildcard(require("http"));

var _debug = _interopRequireDefault(require("debug"));

var _Api = _interopRequireDefault(require("./Api"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

const logger = (0, _debug.default)('rest:startup');
const app = new _Api.default();
const DEFAULT_PORT = 3000;
const port = normalizePort(process.env.REST_PORT); // $FlowFixMe: express libdef issue

const server = http.createServer(app.express);
server.listen(port); //server.setTimeout(3000, function () {
//called if there was a timeout
//});

server.timeout = 3000;
server.on('error', onError);
server.on('listening', onListening);

function normalizePort(val) {
  let port = typeof val === 'string' ? parseInt(val, 10) : val;
  if (port && isNaN(port)) return port;else if (port >= 0) return port;else return DEFAULT_PORT;
}

function onError(error) {
  if (error.syscall !== 'listen') throw error;
  let bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port.toString()}`;

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw error;
  }
}

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  logger(`Listening on ${bind}`);
}
//# sourceMappingURL=index.js.map
