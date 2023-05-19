const { WebStorage } = require('./storage');

function createLocalStorage({ localStorage }) {
    return new WebStorage(localStorage);
}

function createSessionStorage({ sessionStorage }) {
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
} catch {
    console.log(`Window from DOM not available.`);
}
