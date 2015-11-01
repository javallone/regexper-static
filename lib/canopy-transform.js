var through = require('through'),
    canopy = require('canopy');

module.exports = function(file) {
  var data = '';

  if (!/\.peg$/.test(file)) {
    return through();
  }

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
