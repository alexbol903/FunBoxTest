// Mode building

const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
  output: {
    publicPath: './'
  },
	mode: 'production',
  plugins: []
});

