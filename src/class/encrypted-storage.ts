import {
    KeyPath,
    StorageValue,
    Storage
} from './interface';
import { WebStore } from "./storage";
import { Cryptor } from "./cryptor";

export class EncryptedWebStore extends WebStore {
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
        const converted = JSON.parse(decoded);
        return converted;
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
}
