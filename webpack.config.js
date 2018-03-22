module.exports = {
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
