// https://developer.mozilla.org/en-US/docs/Web/API/Storage

export type KeyPath = string;
export type StorageValue = any;
export type StorageItem = { key: KeyPath, value: StorageValue };

/**
 * Attribute compare will work for a collection of items where values match or will replace a value of the matched key for data objects.
 */
export type AttributeCompare = { attribute: string, value: string | number };

export interface Storage {
    /**
     * keypath delimeter. defaults to '.'.
     */
    delimiter: string;

    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     */
    get length(): number;

    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     * @param n When passed a number n, this method will return the name of the nth key in the storage.
     */
    key(n: number): number;

    /**
     * When passed a key name, will return that key's value.
     * @param {KeyPath} key key name.
     */
    getItem(key: KeyPath): StorageValue;

    /**
     * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
     * @param {KeyPath} key A string containing the name of the key you want to create/update.
     * @param {StorageValue} value A string containing the value you want to give the key you are creating/updating.
     */
    setItem(key: KeyPath, value: StorageValue): boolean | Error;

    /**
     * When passed a key name, will remove that key from the storage.
     * @param {KeyPath} key A string containing the name of the key you want to remove.
     */
    removeItem(key: KeyPath): void;

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear(): void;
}

export interface WebStorage extends Storage {
    /**
     * Add multiple entries of key value pairs to the storage.
     * @param {StorageItem[]} items Items to add individually in the storage.
     */
    setMultipleItems(items: StorageItem[]): boolean | Error;

    /**
     * Remove multiple entries found in the specified keypaths.
     * @param {KeyPath[]} keys 
     */
    removeMultipleItems(keys: KeyPath[]): void;

    /**
     * Returns multiple entries found in the specified keypaths.
     * @param {KeyPath[]} keys 
     */
    getMultipleItems(keys: KeyPath[]): StorageValue[];

    /**
     * Append item to an existing item on the storage. Works for object and array type data.
     * @param {KeyPath} key keypath of the data you want to append to.
     * @param {StorageValue} value data value you want to append to.
     */
    appendItemInItems(key: KeyPath, value: StorageValue): boolean | Error;

    /**
     * Updates an item in the specified keypath.
     * @param {KeyPath} key keypath of the data.
     * @param {StorageValue} value value to set.
     * @param {AttributeCompare} attrCompare data key attribute to be updated.
     */
    updateItemInItem(key: KeyPath, value: StorageValue, attrCompare: AttributeCompare): boolean | Error;

    /**
     * Removes an item in the specified keypath.
     * @param {KeyPath} key keypath of the data.
     * @param {StorageValue} value value to set.
     * @param {AttributeCompare} attrCompare data key attribute to be updated.
     */
    removeItemInItem(key: KeyPath, value: StorageValue, attrCompare: AttributeCompare): boolean | Error;

    /**
     * Returns data found in the specified keypath.
     * @param {KeyPath} key keypath of the data.
     */
    getItemInItem(key: KeyPath): StorageValue;
}