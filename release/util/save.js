"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = saveInstructions;
exports.genId = genId;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// use a Flow type import to get our Produce type
//
function saveInstructions(instructions, name) {
  let outpath = _path.default.join(__dirname, '..', '..', 'data', 'produce.json');

  return new Promise((resolve, reject) => {
    // lets not write to the file if we're running tests
    if (process.env.NODE_ENV !== 'test') {
      _fs.default.writeFile(outpath, JSON.stringify(instructions, null, '\t'), err => {
        err ? reject(err) : resolve(outpath);
      });
    }
  });
}

function genId() {
  return 0;
}
//# sourceMappingURL=save.js.map
