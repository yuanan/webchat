const path = require('path');

module.exports = {
  configureWebpack: {
    output: {
      libraryExport: 'default'
    }
  },
  chainWebpack: config => {
    config.performance.set('hints', false);
  }
}