const path = require('path')

module.exports = {
  entry: './index.js',
  cache: true,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  }
}

if ('production' === process.env.NODE_ENV) {
  var CopyWebpackPlugin = require('copy-webpack-plugin')

  module.exports.plugins = [
    new CopyWebpackPlugin([
      { from: 'samples', to: 'samples' },
      { from: 'index.html', to: 'index.html' }
    ])
  ]
}