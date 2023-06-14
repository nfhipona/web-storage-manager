import { AttributeCompare, KeyPath, Storage, StorageItem, StorageValue, WebStorage } from './interface';

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

    appendItemInItems(key: string, value: any): boolean | Error {
        throw new Error('Method not implemented.');
    }

    updateItemInItem(key: string, value: any, attrCompare: AttributeCompare): boolean | Error {
        throw new Error('Method not implemented.');
    }

    removeItemInItem(key: string, value: any, attrCompare: AttributeCompare): boolean | Error {
        throw new Error('Method not implemented.');
    }

    getItemInItem(key: string) {
        throw new Error('Method not implemented.');
    }
}