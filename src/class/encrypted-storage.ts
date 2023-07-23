import {
    KeyPath,
    StorageValue,
    Storage
} from './interface';
import { WebStore } from "./storage";
import { EncryptedWebStorage } from './interface';
import { Cryptor } from "./cryptor";

export class EncryptedWebStore extends WebStore implements EncryptedWebStorage {
    /**
     * Web store to be used for this session.
     */
    #storage: Storage;
    #cryptor: Cryptor;

    /**
     * 
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, cryptor: Cryptor, delimiter: string = '.') {
        super(storage, delimiter);
        this.#storage = storage;
        this.#cryptor = cryptor;
    }

    getItem(key: KeyPath): StorageValue {
        const stringified = this.#storage.getItem(key);
        const decoded = this.#cryptor.decrypt(stringified);
        if (decoded) {
            const converted = JSON.parse(decoded);
            return converted;
        }
        return null;
    }

    setItem(key: KeyPath, value: StorageValue): boolean | Error {
        try {
            const stringified = JSON.stringify(value);
            const encodedString = this.#cryptor.encrypt(stringified);
            this.#storage.setItem(key, encodedString);
            return true;
        } catch (error) {
            throw error;
        }
    }

    getEncryptedRawItem(key: string) {
        return this.#storage.getItem(key);
    }

    setEncryptedRawItem(key: string, value: any): boolean | Error {
        try {
            this.#storage.setItem(key, value);
            return true;
        } catch (error) {
            throw error;
        }
    }
}
