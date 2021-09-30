const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.base.config')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const prod = {
  mode: 'production',
  output: {
      path: path.join(__dirname, './dist/'),
      filename: 'bundle.js',
      publicPath: './'
  },
  plugins: [
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, './dist/')] }),
  ]
}

module.exports = merge.merge(common, prod)