const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
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
    filename: "nouban.js",
    globalObject: "this",
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
