"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.GeneralHandler = void 0;

var _logger = require("./logger");

var _pouchdb = _interopRequireDefault(require("pouchdb"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('gen:handler');

const util = require('util');

const writeFile = util.promisify(require('fs').writeFile);

const packageVersion = require('../package.json').version;

class GeneralHandler {
  constructor() {
    _defineProperty(this, "db", void 0);

    _defineProperty(this, "version", void 0);

    _defineProperty(this, "settings", void 0);

    _defineProperty(this, "dbGeneralKeyId", void 0);

    const dbPath = process.env.DB_PATH || '/data/db';

    _mkdirp.default.sync(dbPath);

    this.dbGeneralKeyId = `generalConfig`;
    this.version = packageVersion;
    this.settings = {
      webURL: "",
      password: "",
      name: ""
    };
    this.db = new _pouchdb.default(`${_path.default.join(dbPath, 'general')}`);
    this.setup().then(() => {}).catch(err => {});
  }

  setup() {
    var _this = this;

    return _asyncToGenerator(function* () {
      try {
        const gen = yield _this.db.get(_this.dbGeneralKeyId);
        const {
          password,
          name,
          webURL
        } = gen;
        _this.settings = { ..._this.settings,
          password,
          name,
          webURL
        };
      } catch (error) {
        //await this.db.put({_id: this.dbGeneralKeyId, password: this.settings.password, name: this.settings.name, webURL: this.settings.webURL});
        try {
          yield _this.db.put({
            _id: _this.dbGeneralKeyId,
            ..._this.settings
          });
        } catch (subErr) {} //ignore
        //No initialize instruction set

      }
    })();
  }

  updateGeneralSettings(newSettings) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const obj = { ..._this2.settings,
        ...newSettings
      };
      let newObj = {
        _id: _this2.dbGeneralKeyId,
        ...obj
      };

      try {
        const doc = yield _this2.db.get(_this2.dbGeneralKeyId);
        newObj._rev = doc._rev;
      } catch (err) {//does not exist
      }

      try {
        const doc = yield _this2.db.put(newObj);
        yield _this2.setup();
      } catch (err) {
        //Ignore errors here, should still be able to work without updating instr logs
        return false; //throw new Error(`Cannot store last executed instruction set response for name ${name}`);
      }

      return true;
    })();
  }

}

exports.GeneralHandler = GeneralHandler;
const generalHandler = new GeneralHandler();
var _default = generalHandler;
exports.default = _default;
//# sourceMappingURL=GeneralHandler.js.map
