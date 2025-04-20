import {
    KeyPath,
    StorageValue,
    Storage
} from './interface';
import { WebStore } from "./storage";

export class EncodedWebStore extends WebStore {
    /**
     * Web store to be used for this session.
     */
    #storage: Storage;

    /**
     * 
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, delimiter: string = '.') {
        super(storage, delimiter);
        this.#storage = storage;
    }

    override getItem(key: KeyPath): StorageValue {
        const stringified = this.#storage.getItem(key);
        const decoded = window.atob(stringified);
        const converted = JSON.parse(decoded);
        return converted;
    }

    override setItem(key: KeyPath, value: StorageValue): boolean | Error {
        try {
            const stringified = JSON.stringify(value);
            const encodedString = window.btoa(stringified);
            this.#storage.setItem(key, encodedString);
            return true;
        } catch (error) {
            throw error;
        }
    }
}