// Setup (and teardown) SVG container template
beforeEach(function() {
  var template = document.createElement('script');
  template.setAttribute('type', 'text/html');
  template.setAttribute('id', 'svg-container-base');
  template.innerHTML = [
    '<div class="svg"><svg></svg></div>',
    '<div class="progress"><div></div></div>'
  ].join('');
  document.body.appendChild(template);

  this.testablePromise = function() {
    var result = {};

    result.promise = new Promise((resolve, reject) => {
      result.resolve = resolve;
      result.reject = reject;
    });

    return result;
  };
});

afterEach(function() {
  document.body.removeChild(document.body.querySelector('#svg-container-base'));
});

// Spy on _gaq.push to prevent unnecessary logging
window._gaq = {
  push() {}
}
