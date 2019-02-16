var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  // output: {
  //   path: path.resolve(__dirname, "./dist"),
  //   // path: path.resolve(__dirname, "./dist", "[hash]"),
  //   // dev环境使用下一行代码
  //   // publicPath: "/dist/",
  //   // filename: "build.js"
  //   // pro环境build时使用下一行代码
  //   // publicPath: "http://iacloud.ceway.com.cn/app-xproject/dist/",
    
  //   // filename: '[hash].build.js',
  //   // 测试环境
  //   publicPath: "http://testwx-iacloud.ceway.com.cn/app-xproject-test/dist/",
  //   filename: "[hash].build.js"
  // },
  output: {
    // dev环境使用下一行代码
    // path: path.resolve(__dirname, "./dist"),
    // publicPath: "/dist/",
    path:path.resolve(__dirname, 'dist'),
    publicPath:'../',//生成的html里的引用路径用 publicPath
    filename: "build.js"

    // pro环境build时使用下一行代码
    // path: path.resolve(__dirname, "./dist", "[hash]"),
    // filename: '[hash].build.js',

  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]"
        }
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "闭环系统",
      filename: "./index.html",
      template: "./index.html",
      inject: "body",
      favicon: "./favicon.ico",
      minify: {
        caseSensitive: false,
        collapseBooleanAttributes: true,
        collapseWhitespace: true
      },
      hash: true,
      cache: true,
      showErrors: true,
      chunks: "",
      chunksSortMode: "auto",
      excludeChunks: "",
      xhtml: false
    })
  ],
  externals: {
    echarts: "echarts"
  },
  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js"
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    port: 9054
  },
  performance: {
    hints: false
  },
  // devtool: "#eval-source-map"
};

if (process.env.NODE_ENV === "production") {
  // module.exports.devtool = "#source-map";
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]);
}
