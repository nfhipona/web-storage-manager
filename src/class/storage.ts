import {
    AttributeCompare,
    KeyPath,
    Storage,
    StorageItem,
    StorageValue,
    WebStorage
} from './interface';

export class WebStore implements WebStorage {
    /**
     * Web store to be used for this session.
     */
    #storage: Storage;
    delimiter: string;

    /**
     * 
     * @param storage Storage interface to be used and initialized.
     */
    constructor(storage: Storage, delimiter: string = '.') {
        this.#storage = storage;
        this.delimiter = delimiter;
    }

    get length(): number {
        return this.#storage.length;
    }

    key(n: number): number {
        return this.#storage.key(n);
    }

    getItem(key: KeyPath): StorageValue {
        const stringified = this.#storage.getItem(key);
        const converted = JSON.parse(stringified);
        return converted;
    }

    setItem(key: KeyPath, value: StorageValue): boolean | Error {
        try {
            const stringified = JSON.stringify(value);
            this.#storage.setItem(key, stringified);
            return true;
        } catch (error) {
            throw error;
        }
    }

    removeItem(key: KeyPath): void {
        this.#storage.removeItem(key);
    }

    clear(): void {
        this.#storage.clear();
    }

    setMultipleItems(items: StorageItem[]): boolean | Error {
        try {
            const hasErrors: string[] = [];
            for (const item of items) {
                const result = this.setItem(item.key, item.value);
                if (!result) {
                    hasErrors.push(item.key);
                }
            }
            if (hasErrors.length > 0) {
                return Error(`Keypath with errors: ${hasErrors.join(',')}`);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    removeMultipleItems(keys: KeyPath[]): void {
        for (const key of keys) {
            this.removeItemInItem(key);
        }
    }

    getMultipleItems(keys: KeyPath[]): StorageValue[] {
        const items: StorageValue[] = [];
        for (const key of keys) {
            const item = this.getItemInItem(key);
            if (item) {
                items.push(item);
            }
        }
        return items;
    }

    appendItemInItem(key: KeyPath, value: any): boolean | Error {
        try {
            const keyPaths: string[] = key.split(this.delimiter);
            const parentKey = keyPaths.shift() as string;
            const childKeys: string[] = keyPaths.map(k => k.trim());
            const data: any = this.getItem(parentKey);

            if (!data) {
                return new Error('Key not found');
            }

            let sourceData: any = data;
            for (const [idx, childKey] of childKeys.entries()) {
                if (!sourceData) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKeys.length - 1) {
                    const targetItem: any = sourceData[childKey];
                    if (Array.isArray(targetItem)) {
                        targetItem.push(value);
                    } else if (typeof targetItem === 'object' && typeof value === 'object') {
                        const mergedData = { ...targetItem, ...value };
                        sourceData[childKey] = mergedData;
                    }
                } else {
                    sourceData = sourceData[childKey];
                }
            }

            return this.setItem(parentKey, data);
        } catch (error) {
            throw error;
        }
    }

    updateItemInItem(key: KeyPath, attrCompare: AttributeCompare | null, newValue: StorageValue): boolean | Error {
        try {
            const keyPaths: string[] = key.split(this.delimiter);
            const parentKey = keyPaths.shift() as string;
            const childKeys: string[] = keyPaths.map(k => k.trim());
            const data: any = this.getItem(parentKey);

            if (!data) {
                return new Error('Key not found');
            }

            let sourceData: any = data;
            for (const [idx, childKey] of childKeys.entries()) {
                if (!sourceData) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKeys.length - 1) {
                    const targetItem: any = sourceData[childKey];
                    if (Array.isArray(targetItem) && attrCompare) {
                        const foundIdx = this.#indexOfObject(targetItem, attrCompare);
                        targetItem[foundIdx] = newValue;
                    } else if (typeof targetItem === 'object' && attrCompare) {
                        targetItem[attrCompare.name] = newValue;
                        sourceData[childKey] = targetItem;
                    } else {
                        sourceData[childKey] = newValue;
                    }
                } else {
                    sourceData = sourceData[childKey];
                }
            }

            return this.setItem(parentKey, data);
        } catch (error) {
            throw error;
        }
    }

    removeItemInItem(key: KeyPath, attrCompare?: AttributeCompare): boolean | Error {
        try {
            const keyPaths: string[] = key.split(this.delimiter);
            const parentKey = keyPaths.shift() as string;
            const childKeys: string[] = keyPaths.map(k => k.trim());

            if (childKeys.length === 0) {
                this.removeItem(parentKey);
                return true;
            }

            const data: any = this.getItem(parentKey);
            if (!data) {
                return new Error('Key not found');
            }

            let sourceData: any = data;
            for (const [idx, childKey] of childKeys.entries()) {
                if (!sourceData) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKeys.length - 1) {
                    const targetItem: any = sourceData[childKey];
                    if (Array.isArray(targetItem) && attrCompare) {
                        const foundIdx = this.#indexOfObject(targetItem, attrCompare);
                        sourceData[childKey].splice(foundIdx, 1);
                    } else if (typeof targetItem === 'object' && attrCompare) {
                        delete targetItem[attrCompare.name];
                        sourceData[childKey] = targetItem;
                    } else {
                        delete sourceData[childKey];
                    }
                } else {
                    sourceData = sourceData[childKey];
                }
            }

            return this.setItem(parentKey, data);
        } catch (error) {
            throw error;
        }
    }

    getItemInItem(key: KeyPath, attrCompare?: AttributeCompare): StorageValue {
        const keyPaths: string[] = key.split(this.delimiter);
        const parentKey = keyPaths.shift() as string;
        const childKeys: string[] = keyPaths.map(k => k.trim());
        const data: any = this.getItem(parentKey);

        if (!data) {
            return new Error('Key not found');
        }

        let sourceData: any = data;
        for (const [idx, childKey] of childKeys.entries()) {
            if (!sourceData) {
                return new Error('Key not found or data source is in an invalid or unsupported format');
            }

            if (idx === childKeys.length - 1) {
                const targetItem: any = sourceData[childKey];
                if (Array.isArray(targetItem) && attrCompare) {
                    const foundIdx = this.#indexOfObject(targetItem, attrCompare);
                    return targetItem[foundIdx];
                } else if (typeof targetItem === 'object' && attrCompare) {
                    return targetItem[attrCompare.name];
                }
                return targetItem;
            } else {
                sourceData = sourceData[childKey];
            }
        }

        return sourceData;
    }

    /**
     * Helpers
     */

    /**
     * Find and returns index of the target item
     * @param {Object[]} sourceData - collection of objects
     * @param {AttributeCompare} attrCompare - object to find index from the collection
     * @returns {number} index of found matching item
     */
    #indexOfObject(sourceData: Record<string, any>[], attrCompare: AttributeCompare): number {
        if (!Array.isArray(sourceData) && attrCompare && attrCompare.name && attrCompare.value) return -1;
        for (const [idx, data] of sourceData.entries()) {
            let targetValue = data[attrCompare.name];
            if (typeof attrCompare.value === 'number') { // check the type of searched value and try to compare with it's inherent type
                targetValue = Number(targetValue)
            }
            if (targetValue === attrCompare.value) {
                return idx;
            }
        }
        return -1;
    }
}