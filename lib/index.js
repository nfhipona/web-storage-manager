var {
  WebStorage
} = require('./storage');
function createLocalStorage(_ref) {
  var {
    localStorage
  } = _ref;
  return new WebStorage(localStorage);
}
function createSessionStorage(_ref2) {
  var {
    sessionStorage
  } = _ref2;
  return new WebStorage(sessionStorage);
}
module.exports = {
  createLocalStorage,
  createSessionStorage,
  WebStorage
};
try {
  if (window) {
    exports.LocalStorage = createLocalStorage(window);
    exports.SessionStorage = createSessionStorage(window);
  }
} catch (_unused) {
  console.log("Window from DOM not available.");
}