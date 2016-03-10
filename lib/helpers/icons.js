module.exports.register = function(handlebars) {
  handlebars.registerHelper('icon', function(selector, context) {
    return new handlebars.SafeString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 8 8"><use xlink:href="${selector}" /></svg>`);
  });
};
