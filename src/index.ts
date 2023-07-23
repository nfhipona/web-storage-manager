import { WebStore } from './class/storage';
import { EncodedWebStore } from './class/encoded-storage';
import { Cryptor } from "./class/cryptor";
import { EncryptedWebStore } from './class/encrypted-storage';

export interface Options {
    delimiter?: string,
    isEncoded: boolean
}

function createLocalStorage({ localStorage }: any = window, { delimiter = '.', isEncoded = false }: Options) {
    return isEncoded ? new EncodedWebStore(localStorage, delimiter) : new WebStore(localStorage, delimiter);
}

function createSessionStorage({ sessionStorage }: any = window, { delimiter = '.', isEncoded = false }: Options) {
    return isEncoded ? new EncodedWebStore(sessionStorage, delimiter) : new WebStore(sessionStorage, delimiter);
}

function createEncryptedLocalStorage({ localStorage }: any = window, cryptor: Cryptor, delimiter = '.') {
    return new EncryptedWebStore(localStorage, cryptor, delimiter);
}

function createEncryptedSessionStorage({ sessionStorage }: any = window, cryptor: Cryptor, delimiter = '.') {
    return new EncryptedWebStore(sessionStorage, cryptor, delimiter);
}

module.exports = {
    createLocalStorage,
    createSessionStorage,
    createEncryptedLocalStorage,
    createEncryptedSessionStorage,

    LocalStorage: createLocalStorage(window, { isEncoded: false }),
    SessionStorage: createSessionStorage(window, { isEncoded: false }),
    EncodedLocalStorage: createLocalStorage(window, { isEncoded: true }),
    EncodedSessionStorage: createSessionStorage(window, { isEncoded: true }),

    WebStore,
    EncodedWebStore,
    Cryptor,
    EncryptedWebStore
};