const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { configDotenv } = require("dotenv");

configDotenv();
// .env 파일에 등록한 변수를 process.env로 접근가능하게 만들어줌
// (ex)process.env.KAKAO_MAP_KEY

const prod = process.env.NODE_ENV === "production";

module.exports = {
  mode: prod ? "production" : "development",

  devtool: prod ? "hidden-source-map" : "eval",

  entry: "./src/index.tsx",

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },

  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.css?$/,
        exclude: /node_modules/,
        use: [prod ? MiniCssExtractPlugin.loader : "style-loader", "css-loader"],
      },
    ],
  },

  output: {
    path: path.join(__dirname, "/dist"),
    filename: "static/js/[name].[contenthash:8].js", // or "bundle.js"
    clean: true,
  },

  optimization: {
    minimize: false,
  },

  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
    }),
    prod
      ? new HtmlWebpackPlugin({
          template: "./index.html",
          minify: true,
        })
      : new HtmlWebpackPlugin({
          template: "./index.html",
        }),
    new webpack.HotModuleReplacementPlugin(),
    prod
      ? new MiniCssExtractPlugin({
          linkType: false,
          filename: "[name].[contenthash:8].css",
        })
      : undefined,
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ].filter(Boolean), // undefined값을 반환하면 안되기 때문에 filter를 이용해 불리언형식의 값을 제외해준다.(webpack문법)

  devServer: {
    port: 3000,
    hot: true,
    open: true,
    client: {
      overlay: true,
      progress: true,
    },
    historyApiFallback: true,
  },
};
