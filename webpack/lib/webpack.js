const Compiler = require("./Compiler");
const NodeEnvironmentPlugin = require("./node/NodeEnvironmentPlugin");
const webpack = (options, callback) => {
  const compiler = new Compiler();
  compiler.options = options;

  new NodeEnvironmentPlugin().apply(compiler);

  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugins) {
      plugin.apply(compiler);
    }
  }

  return compiler;
};

module.exports = webpack;
