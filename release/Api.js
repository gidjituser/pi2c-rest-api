"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _GeneralHandler = _interopRequireDefault(require("./GeneralHandler"));

var _InstructionRouter = _interopRequireDefault(require("./routers/InstructionRouter"));

var _GeneralRouter = _interopRequireDefault(require("./routers/GeneralRouter"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const cors = require('cors');

const auth = require('basic-auth');

const compare = require('tsscmp');

class Api {
  // annotate with the express $Application type
  // create the express instance, attach app-level middleware, attach routers
  constructor() {
    _defineProperty(this, "express", void 0);

    this.express = (0, _express.default)();
    this.middleware();
    this.routes();
  } // register middlewares


  middleware() {
    this.express.use((0, _morgan.default)('dev'));
    this.express.use(_bodyParser.default.json());
    this.express.use(_bodyParser.default.urlencoded({
      extended: false
    }));
    this.express.use(cors()); // $FlowFixMe: express libdef issue

    this.express.use((req, res, next) => {
      //If localhost or link local allow without authorization header (Authorization: Basic <_base64_token_>)
      // <_base64_token_> is username:password in base64 format
      let ip = req.ip;

      if (req.ip && req.ip.startsWith('::ffff:')) {
        ip = req.ip.substr(7);
      }

      if (ip && (ip.startsWith('169.254.') || ip.startsWith('fe80::') || ip === '::1' || ip === '127.0.0.1')) {
        next();
        return;
      }

      if (_GeneralHandler.default.settings.password.length === 0 || _GeneralHandler.default.settings.password === 'none') {
        next();
        return;
      }

      const credentials = auth(req);

      if (!credentials || !credentials.pass || typeof credentials.pass !== 'string' || !compare(credentials.pass, _GeneralHandler.default.settings.password)) {
        res.set('WWW-Authenticate', 'Basic realm="401"'); // change this

        res.status(401).json({
          message: 'Password Authentication required.',
          code: 4
        }); // custom message

        return;
      }

      next();
    });
  } // connect resource routers


  routes() {
    // create an instance of ProduceRouter
    const instructionRouter = new _InstructionRouter.default();
    const generalRouter = new _GeneralRouter.default(); // attach it to our express app

    this.express.use(instructionRouter.path, instructionRouter.router);
    this.express.use(generalRouter.path, generalRouter.router);
  }

}

exports.default = Api;
//# sourceMappingURL=Api.js.map
