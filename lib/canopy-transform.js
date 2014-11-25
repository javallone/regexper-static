var through = require('through'),
    canopy = require('canopy');

module.exports = function(file) {
  if (!/\.peg$/.test(file)) {
    return through();
  }

  var data = '';

  return through(
    function(buf) {
      data += buf;
    },
    function() {
      try {
        this.queue(String(canopy.compile(data)));
      } catch(err) {
        this.emit('error', err);
      }
      this.queue(null);
    }
  );
};
