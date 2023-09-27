import { KeyPath, StorageValue, Storage } from './interface';
import { WebStore } from "./storage";
export declare class EncodedWebStore extends WebStore {
    #private;
    /**
     *
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, delimiter?: string);
    getItem(key: KeyPath): StorageValue;
    setItem(key: KeyPath, value: StorageValue): boolean | Error;
}
