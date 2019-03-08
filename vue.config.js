// see http://vuejs-templates.github.io/webpack for documentation.
var path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
const CompressionPlugin = require("compression-webpack-plugin"); //Gzip
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin; //Webpack包文件分析器
module.exports = {
  publicPath: "./", //根路径
  outputDir: process.env.outputDir, // 输出目录 那npm run build
  assetsDir: "static", //静态资源目录(js/css/img/icon)
  lintOnSave: process.env.NODE_ENV !== "production", // 是否开启eslint保存检测
  //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
  parallel: require("os").cpus().length > 1,
  productionSourceMap: false,
  devServer: {
    open: false, // 是否自动在游览器中打开
    host: "0.0.0.0", // 主机名字
    port: 8080,
    https: false, //
    hotOnly: false, // 热更新
    disableHostCheck: true,
    // proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
    // proxy: {
    //   //配置自动启动浏览器
    //   "/rest/*": {
    //     target: "http://172.16.1.12:7071",
    //     changeOrigin: true,
    //     // ws: true,//websocket支持
    //     secure: false
    //   },
    //   "/pbsevice/*": {
    //     target: "http://172.16.1.12:2018",
    //     changeOrigin: true,
    //     //ws: true,//websocket支持
    //     secure: false
    //   }
    // },
    before: app => {}
  },
  chainWebpack: config => {
    /**
     * 删除懒加载模块的prefetch，降低带宽压力
     * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
     * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
     */
    config.plugins.delete("prefetch");
    //if(process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
    //} else {// 为开发环境修改配置...
    //}

    // 目录别名
    config.resolve.alias.set("@", resolve("./src"));
  },
  configureWebpack: config => {
    //入口文件
    // config.entry.app = ["babel-polyfill", "./src/main.js"];

    //生产and测试环境
    let pluginsPro = [
      new CompressionPlugin({
        //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
        filename: "[path].gz[query]",
        algorithm: "gzip",
        test: new RegExp("\\.(" + ["js", "css"].join("|") + ")$"),
        threshold: 8192,
        minRatio: 0.8
      }),
      //	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
      new BundleAnalyzerPlugin()
    ];
    //开发环境
    // let pluginsDev = [
    //   //移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
    //   new vConsolePlugin({
    //     filter: [], // 需要过滤的入口文件
    //     enable: true // 发布代码前记得改回 false
    //   })
    // ];
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
      config.plugins = [...config.plugins, ...pluginsPro];
    } else {
      // 为开发环境修改配置...
      // config.plugins = [...config.plugins, ...pluginsDev];
    }
  },
  css: {
    // 启用 CSS modules
    modules: false,
    // 是否使用css分离插件
    extract: true,
    // 开启 CSS source maps，一般不建议开启
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      sass: {
        //设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
        data: `
				$baseUrl: "/";
				@import '@/assets/scss/_common.scss';
				`
      }
    }
  }
};
