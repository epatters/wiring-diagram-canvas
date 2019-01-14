module.exports = {
  mode: "development",
  entry: {
    "simple-flow": "./examples/simple-flow/index.tsx",
  },
  output: {
    filename: "[name]/bundle.js",
    path: __dirname + "/examples"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader"
      }
    ]
  },
};
