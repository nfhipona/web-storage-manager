const { WebStorage } = require('./storage');

function createLocalStorage({ localStorage } = window) {
    return new WebStorage(localStorage);
}

function createSessionStorage({ sessionStorage } = window) {
    return new WebStorage(sessionStorage);
}

module.exports = {
    createLocalStorage,
    createSessionStorage,
    LocalStorage: createLocalStorage(window),
    SessionStorage: createSessionStorage(window),
    WebStorage
};