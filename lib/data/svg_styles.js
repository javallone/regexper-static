var fs = require('fs'),
    path = require('path'),
    config = require('../../config');

module.exports = fs.readFileSync(path.join(config.compass.css, 'svg.css'), {
  encoding: 'utf-8'
})
