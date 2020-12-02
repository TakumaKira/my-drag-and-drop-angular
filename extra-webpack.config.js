const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        UNSPLASH_ACCESS_KEY: JSON.stringify(process.env.UNSPLASH_ACCESS_KEY),
        BUGSNAG_API_KEY: JSON.stringify(process.env.BUGSNAG_API_KEY),
      }
    })
  ]
}
