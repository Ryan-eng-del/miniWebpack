const {
  SyncHook,
  SyncBailHook,
  AsyncSeriesHook,
  AsyncParallelHook,
} = require("tapable");

let NormalModuleFactory = require("./NormalModuleFactory");

class Compiler {
  options;
  constructor(context) {
    this.context = context;
    this.hooks = {
      //context项目根目录的绝对路径 C:\aproject\zhufeng202009webpack\8.my
      //entry入口文件路径 ./src/index.js
      entryOption: new SyncBailHook(["context", "entry"]),
      beforeRun: new AsyncSeriesHook(["compiler"]), //运行前
      run: new AsyncSeriesHook(["compiler"]), //运行
      beforeCompile: new AsyncSeriesHook(["params"]), //编译前
      compile: new SyncHook(["params"]), //编译
      make: new AsyncParallelHook(["compilation"]), //make构建//TODO
      thisCompilation: new SyncHook(["compilation", "params"]), //开始一次新的编译
      compilation: new SyncHook(["compilation", "params"]), //创建完成一个新的compilation
      afterCompile: new AsyncSeriesHook(["compilation"]), //编译完成
      emit: new AsyncSeriesHook(["compilation"]), // 发射或者说写入
      done: new AsyncSeriesHook(["stats"]), //所有的编译全部都完成
    };
  }
  run(callback) {
    const onCompiled = (err, compilation) => {
      this.emitAssets(compilation, (err) => {
        //先收集编译信息 chunks entries modules files
        let stats = new Stats(compilation);
        // 再触发done这个钩子执行
        this.hooks.done.callAsync(stats, (err) => {
          callback(err, stats);
        });
      });
    };

    this.hooks.beforeRun.callAsync(this, (err) => {
      this.hooks.run.callAsync(this, (err) => {
        this.compile(onCompiled);
      });
    });
  }

  compile(onCompiled) {
    const params = this.newCompilationParams();

    this.hooks.beforeCompile.callAsync(params, (err) => {
      this.hooks.compile.call(params);
      //创建一个新compilation对象
      const compilation = this.newCompilation(params);
      //触发make钩子的回调函数执行
      this.hooks.make.callAsync(compilation, (err) => {
        console.log(err, "err make.callAsync");
      });
    });
  }

  newCompilationParams() {
    const params = {
      //在创建compilation这前已经创建了一个普通模块工厂
      normalModuleFactory: new NormalModuleFactory(), //TODO
    };
    return params;
  }

  createCompilation() {
    //  返回 Compilation
    // return new Compilation(this);
    return {};
  }

  newCompilation(params) {
    const compilation = this.createCompilation();
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
}

module.exports = Compiler;
