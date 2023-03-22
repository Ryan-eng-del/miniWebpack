const { AsyncSeriesHook } = require("tapable");

class Compiler {
  options;
  constructor(context) {
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(["stats"]),
    };
  }
  run(callback) {
    callback(null, {
      toJson() {
        return {
          entries: [],
          chucks: [],
        };
      },
    });
  }
}

module.exports = Compiler;
