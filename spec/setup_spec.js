beforeEach(function() {
  var template = document.createElement('script');
  template.setAttribute('type', 'text/html');
  template.setAttribute('id', 'svg-container-base');
  template.innerHTML = [
    '<div class="svg"><svg></svg></div>',
    '<div class="progress"><div></div></div>'
  ].join('');
  document.body.appendChild(template);
});

afterEach(function() {
  document.body.removeChild(document.body.querySelector('#svg-container-base'));
});
