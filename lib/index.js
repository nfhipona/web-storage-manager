var {
  WebStorage
} = require('./storage');
function createLocalStorage() {
  var {
    localStorage
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  return new WebStorage(localStorage);
}
function createSessionStorage() {
  var {
    sessionStorage
  } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  return new WebStorage(sessionStorage);
}
module.exports = {
  createLocalStorage,
  createSessionStorage,
  LocalStorage: createLocalStorage(window),
  SessionStorage: createSessionStorage(window),
  WebStorage
};