export function customEvent(name, detail) {
  var evt = document.createEvent('Event');
  evt.initEvent(name, true, true);
  evt.detail = detail;
  return evt;
}
