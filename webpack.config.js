module.exports = {
  optimization: {
    minimize: false
  },
  output: {
    library: 'reduxon',
    libraryTarget: 'umd',
  },
  plugins: [],
  mode: 'production',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}
