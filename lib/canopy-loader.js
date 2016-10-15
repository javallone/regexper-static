var canopy = require('canopy');

module.exports = function(source) {
  this.cacheable();
  return canopy.compile(source);
};
