import { WebStore } from './class/storage';

function createLocalStorage({ localStorage }: any = window, delimiter: string = '.') {
    return new WebStore(localStorage, delimiter);
}

function createSessionStorage({ sessionStorage }: any = window, delimiter: string = '.') {
    return new WebStore(sessionStorage, delimiter);
}

module.exports = {
    createLocalStorage,
    createSessionStorage,
    LocalStorage: createLocalStorage(window),
    SessionStorage: createSessionStorage(window),
    WebStore
};