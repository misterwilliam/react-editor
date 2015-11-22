module.exports = {
  entry: './index.js',
  output: {
    filename: './dist.js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react'],
        }
      },
    ],
    loaders: [
      { test: /\.json$/, loader: "json-loader" },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        }
      }, {
        test: /\.css$/,
        loader: "style-loader!css-loader",
      }
    ],
  }
};