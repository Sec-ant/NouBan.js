const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

const defaultConfigs = {
  entry: "./src/index.ts",
  mode: "production",
  module: {
    rules: [
      {
        test: /censoredWords\.ts$/,
        use: [{ loader: "val-loader" }],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    library: "NouBan",
    libraryTarget: "umd",
    globalObject: "window",
    publicPath: "",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            ascii_only: true,
          },
          toplevel: true,
        },
      }),
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};

module.exports = [
  {
    ...defaultConfigs,
    externals: {
      "opencc-js": "OpenCC",
      "./wordsArray": "wordsArray",
      "./whiteList": "whiteList",
    },
    output: {
      ...defaultConfigs.output,
      filename: "nouban.js",
    },
  },
  {
    ...defaultConfigs,
    output: {
      ...defaultConfigs.output,
      filename: "nouban.bundle.js",
    },
  },
];
