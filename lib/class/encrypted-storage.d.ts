import { KeyPath, StorageValue, Storage, EncryptedWebStorage } from './interface';
import { WebStore } from "./storage";
import { Cryptor } from "./cryptor";
export declare class EncryptedWebStore extends WebStore implements EncryptedWebStorage {
    #private;
    /**
     *
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, cryptor: Cryptor, delimiter?: string);
    getItem(key: KeyPath): StorageValue;
    setItem(key: KeyPath, value: StorageValue): boolean | Error;
    getEncryptedRawItem(key: string): any;
    setEncryptedRawItem(key: string, value: any): boolean | Error;
}
