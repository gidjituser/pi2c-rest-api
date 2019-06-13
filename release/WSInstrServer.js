"use strict";

var _parsers = require("./util/parsers");

var _logger = require("./logger");

var _InstrHandler = _interopRequireDefault(require("./InstrHandler"));

var _temp;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const WebSocket = require('ws');

const debug = require('debug')('ws:instr');

module.exports = (_temp = class WSInstrServer {
  constructor() {
    _defineProperty(this, "wsServer", void 0);

    this.wsServer = null;
  }

  setup(httpServer) {
    //this.wsServer = new WebSocket.Server({ server:  port: process.env.WS_PORT || 8080 });
    this.wsServer = new WebSocket.Server({
      path: "/ws/instr/exec",
      server: httpServer
    });
    this.wsServer.on('connection', (ws, request) => {
      if (request.connection && typeof request.connection.remoteAddress === 'string') {
        _logger.logger.info(`WS Server connection from ${request.connection.remoteAddress}`);
      }

      ws.on('message', message => {
        debug(`WSMESSAGE ${message}`);

        if (typeof message === 'string') {
          try {
            const val = JSON.parse(message);
            const received = (0, _parsers.parseInstructions)(val);

            if (!received) {
              ws.send(JSON.stringify({
                code: 400,
                message: 'Bad Request. Make sure that you submit valid Instructions. Array of Instruction stringified'
              }));

              _logger.logger.error('Malformed WS message');

              return;
            }

            const newInstructions = val;

            _InstrHandler.default.executeInstructions(newInstructions).then(instrResp => {
              ws.send(JSON.stringify(instrResp));
            }).catch(error => {
              ws.send(JSON.stringify({
                code: 401,
                message: `Could not execute instructions ${error.message}`
              }));
            });
          } catch (error) {
            ws.send(JSON.stringify({
              code: 402,
              message: `Bad Request. Could not parse instructions. Require array of Instruction stringified. ${error.message}`
            }));
          }
        } else {
          ws.send(JSON.stringify({
            code: 400,
            message: `Cannot process data with type ${typeof message}`
          }));
        }
      });
    });
  }

  close() {
    if (this.wsServer) {
      this.wsServer.close(error => {});
      this.wsServer = null;
    }
  }

}, _temp);
//# sourceMappingURL=WSInstrServer.js.map
