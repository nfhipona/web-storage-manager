import { WebStore } from './class/storage';
import { EncodedWebStore } from './class/encoded-storage';
import { Cryptor, CryptorDefaults } from "./class/cryptor";
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

function createEncryptedLocalStorage(cryptor: Cryptor, { localStorage }: any = window, delimiter = '.') {
    return new EncryptedWebStore(localStorage, cryptor, delimiter);
}

function createEncryptedSessionStorage(cryptor: Cryptor, { sessionStorage }: any = window, delimiter = '.') {
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
    CryptorDefaults,
    Cryptor,
    EncryptedWebStore
};