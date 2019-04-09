// Mode development

const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
  output: {
    publicPath: '/'
  },
  mode: 'development',
  devtool: '#@cheap-module-eval-source-map',
	devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
		port: 8081,
		overlay: {
			warnings: false,
			errors: true
		}
	},
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map'
    })
  ]
});
