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


    appendItem(key: string, value: any): boolean | Error {
        try {
            const data = this.getItem(key);
            if (Array.isArray(data)) {
                data.push(value);
            } else if (typeof data === 'object') {
                data[key] = value;
            }
            return this.setItem(key, data);
        } catch (error) {
            throw error;
        }
    }

    setMultipleItems(items: StorageItem[]): boolean | Error {
        try {
            for (const item of items) {
                const stringified = JSON.stringify(item.value);
                this.#storage.setItem(item.key, stringified);
            }
            return true;
        } catch (error) {
            throw error;
        }
    }

    removeMultipleItems(keys: KeyPath[]): void {
        for (const key of keys) {
            this.#storage.removeItem(key);
        }
    }

    getMultipleItems(keys: KeyPath[]): StorageValue[] {
        const items: StorageValue[] = [];
        for (const key of keys) {
            const item = this.getItem(key);
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
                sourceData = sourceData[childKey];

                if (!sourceData) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKey.length - 1) {
                    if (Array.isArray(sourceData)) {
                        sourceData.push(value);
                    } else if (typeof sourceData === 'object' && typeof value === 'object') {
                        sourceData[childKey] = { ...sourceData, ...value };
                    }
                }
            }

            return this.setItem(parentKey, data);;
        } catch (error) {
            throw error;
        }
    }

    updateItemInItem(key: KeyPath, value: any, attrCompare?: AttributeCompare): boolean | Error {
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
                sourceData = sourceData[childKey];

                if (!sourceData) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKey.length - 1) {
                    if (Array.isArray(sourceData) && attrCompare) {
                        const foundIdx = this.#indexOfObject(sourceData, attrCompare);
                        sourceData[foundIdx] = value;
                    } else if (typeof sourceData === 'object' && typeof value === 'object') {
                        sourceData[childKey] = { ...sourceData, ...value };
                    }
                }
            }

            return this.setItem(parentKey, data);;
        } catch (error) {
            throw error;
        }
    }

    removeItemInItem(key: KeyPath, attrCompare: AttributeCompare): boolean | Error {
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
                const sourceDataTmp = sourceData[childKey];

                if (!sourceDataTmp) {
                    return new Error('Key not found or data source is in an invalid or unsupported format');
                }

                if (idx === childKey.length - 1) {
                    if (Array.isArray(sourceDataTmp) && attrCompare) {
                        const foundIdx = this.#indexOfObject(sourceDataTmp, attrCompare);
                        sourceData[childKey].splice(foundIdx, 1);
                    } else if (typeof sourceData === 'object') {
                        delete sourceData[childKey];
                    }
                } else {
                    sourceData = sourceDataTmp;
                }
            }

            return this.setItem(parentKey, data);;
        } catch (error) {
            throw error;
        }
    }

    getItemInItem(key: KeyPath): StorageValue {
        const keyPaths: string[] = key.split(this.delimiter);
        const parentKey = keyPaths.shift() as string;
        const childKeys: string[] = keyPaths.map(k => k.trim());
        const data: any = this.getItem(parentKey);

        if (!data) {
            return new Error('Key not found');
        }

        let sourceData: any = data;
        for (const childKey of childKeys) {
            if (!sourceData && !Array.isArray(sourceData)) {
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
        if (!Array.isArray(sourceData)) return -1;
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