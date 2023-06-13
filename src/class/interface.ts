// https://developer.mozilla.org/en-US/docs/Web/API/Storage

export type KeyPath = string;
export type StorageValue = any | null;
export type StorageItem = { key: KeyPath, value: StorageValue };

/**
 * Attribute compare will work for a collection of items where values match or will replace a value of the matched key for data objects.
 */
export type AttributeCompare = { attribute: string, value: string | number };

export interface Storage {
    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     */
    length(): number

    /**
     * Returns an integer representing the number of data items stored in the Storage object.
     * @param n When passed a number n, this method will return the name of the nth key in the storage.
     */
    key(n: number): number

    /**
     * When passed a key name, will return that key's value.
     * @param {KeyPath} key key name.
     */
    getItem(key: KeyPath): StorageValue

    /**
     * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
     * @param {KeyPath} key A string containing the name of the key you want to create/update.
     * @param {StorageValue} value A string containing the value you want to give the key you are creating/updating.
     */
    setItem(key: KeyPath, value: StorageValue): boolean | Error

    /**
     * When passed a key name, will remove that key from the storage.
     * @param {KeyPath} key A string containing the name of the key you want to remove.
     */
    removeItem(key: KeyPath): void

    /**
     * When invoked, will empty all keys out of the storage.
     */
    clear(): void
}

export interface WebStorage extends Storage {
    /**
     * Add multiple entries of key value pairs to the storage.
     * @param {Array.<StorageItem>} items Items to add individually in the storage.
     */
    setMultipleItems(items: [StorageItem]): boolean | Error

    /**
     * Append item to an existing item on the storage. Works for object and array type data.
     * @param key key path of the data you want to append to.
     * @param value data value you want to append to.
     */
    appendItemInItems(key: KeyPath, value: StorageValue): boolean | Error

    /**
     * Updates an item in the specified key path.
     * @param key key path of the data.
     * @param value value to set.
     * @param attrCompare data key attribute to be updated.
     */
    updateItemInItem(key: KeyPath, value: StorageValue, attrCompare: AttributeCompare): boolean | Error

    getItemInItem(key: KeyPath): StorageValue
}