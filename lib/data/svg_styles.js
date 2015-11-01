var fs = require('fs'),
    path = require('path'),
    config = require('../../config');

module.exports = fs.readFileSync(config.buildPath('css/svg.css'), {
  encoding: 'utf-8'
});
