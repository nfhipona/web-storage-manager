import { AttributeCompare, KeyPath, Storage, StorageItem, StorageValue, WebStorage } from './interface';
export declare class WebStore implements WebStorage {
    #private;
    delimiter: string;
    /**
     *
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, delimiter?: string);
    get length(): number;
    key(n: number): number;
    getItem(key: KeyPath): StorageValue;
    setItem(key: KeyPath, value: StorageValue): boolean | Error;
    removeItem(key: KeyPath): void;
    clear(): void;
    setMultipleItems(items: StorageItem[]): boolean | Error;
    removeMultipleItems(keys: KeyPath[]): void;
    getMultipleItems(keys: KeyPath[]): StorageValue[];
    appendItemInItem(key: KeyPath, value: any): boolean | Error;
    updateItemInItem(key: KeyPath, attrCompare: AttributeCompare | null, newValue: StorageValue): boolean | Error;
    removeItemInItem(key: KeyPath, attrCompare?: AttributeCompare): boolean | Error;
    getItemInItem(key: KeyPath, attrCompare?: AttributeCompare): StorageValue;
}
