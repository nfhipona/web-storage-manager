export class WebStorage {
    #storage = null;
    constructor(storage) {
        this.#storage = storage;
    }

    length() {
        return this.#storage.length;
    }

    key(index) {
        return this.#storage.key(index);
    }

    /**
     *
     * @param {string} key - data key
     * @param {*} value - data value
     *
     */
    setItem(key, value, encoded = false) {

        try {
            const d = encoded ? this.encode(value) : JSON.stringify(value);
            this.#storage.setItem(key, d);

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {Object[]} items - collection
     * @param {Object} items[].item - item object
     * @param {string} items[].item.key - data key
     * @param {*} items[].item.value - data value
     *
     */
    setMultiple(items, encoded) {
        if (!Array.isArray(items)) return;

        try {
            for (const i of items) {
                const d = encoded ? this.encode(i.value) : JSON.stringify(i.value);
                this.#storage.setItem(i.key, d);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {string} key - data key
     * @param {*} value - data value
     *
     */
    appendItem(key, value) {

        try {
            const data = this.#storage.getItem(key);
            const r = this.isDataEncoded(data);

            const collection = r[1];
            if (!collection) return; // return as we don't know what format the data should be saved

            const newData = this.combineObject(value, collection);

            return this.setItem(key, newData, r[0] === 1);
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {Object} object - object to combine
     * @param {Object} toObject - object to combine to
     *
     */
    combineObject(object, toObject) {

        for (const key in object) {
            toObject[key] = object[key];
        }

        return toObject;
    }

    /**
     *
     * @param {Object[]} collection - collection of objects
     * @param {Object} object - object to find index from the collection
     * @param {string} attr - attribute of the object to compare to
     *
     */
    indexOfObject(collection, object, attr) {

        if (!object) return -1;

        for (let i = 0; i < collection.length; i++) {
            if (collection[i][attr] === object[attr]) {
                return i;
            }
        }

        return -1;
    }

    /**
     *
     * @param {string} keyPath - key path parentKey.childKey.key
     * @param {string} value - data value
     * @param {string} attrCompare - data attrib compare
     *
     */
    updateItemInItem(keyPath, value, attrCompare) {

        try {
            const keys = keyPath.split(".");
            const parentKey = keys.shift();

            const data = this.#storage.getItem(parentKey);
            const r = this.isDataEncoded(data);

            let collection = r[1]; // get old collection
            if (!collection) return false; // terminate process

            let tmpCollection = {};

            const childKeys = keys.map(k => k.trim());

            // iterate through with child keys
            for (const [idx, key] of childKeys.entries()) {
                if (!collection) return false; // terminate on key not found

                collection = collection[key]; // map data get value from key path

                if (idx === childKeys.length - 1) {

                    if (!Array.isArray(collection)) { // check if type object
                        collection = value; // replace with new value
                    } else {
                        // collection
                        const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

                        // append or replace object at index
                        if (idx >= 0) {
                            collection[idx] = value;
                        } else {
                            collection.push(value);
                        }
                    }

                    // add to temp collection
                    tmpCollection[key] = collection;
                    this.#mapDataUpdate(tmpCollection, parentKey, childKeys, r[0] === 1);
                } else {
                    // add to temp collection
                    tmpCollection[key] = collection;
                }
            }

        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {string} keyPath - key path parentKey.childKey.key
     * @param {string} value - data value
     * @param {string} attrCompare - data attrib compare
     *
     */
    getItemInItem(keyPath, value, attrCompare) {

        try {
            const keys = keyPath.split(".");
            const parentKey = keys.shift();

            let collection = this.getItem(parentKey);
            if (!collection) return false; // terminate process

            const childKeys = keys.map(k => k.trim());

            // iterate through with child keys
            for (const [idx, key] of childKeys.entries()) {
                if (!collection) return false; // terminate on key not found

                collection = collection[key]; // map data get value from key path

                if (idx === childKeys.length - 1) {

                    if (!Array.isArray(collection)) { // check if type object
                        return collection; // return value
                    } else {
                        // collection
                        const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

                        // return value
                        if (idx >= 0) {
                            return collection[idx];
                        }
                    }

                    return null;
                }
            }

        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {string} keyPath - key path parentKey.childKey.key
     * @param {string} value - data value
     * @param {string} attrCompare - data attrib compare
     *
     */
    removeItemInItem(keyPath, value, attrCompare) {

        try {
            const keys = keyPath.split(".");
            const parentKey = keys.shift();

            const data = this.#storage.getItem(parentKey);
            const r = this.isDataEncoded(data);

            let collection = r[1];
            if (!collection) return false; // terminate process

            let tmpCollection = {};

            const childKeys = keys.map(k => k.trim());

            // iterate through with child keys
            for (const [idx, key] of childKeys.entries()) {
                if (!collection) return false; // terminate on key not found

                collection = collection[key]; // map data get value from key path

                if (idx === childKeys.length - 1) {

                    if (Array.isArray(collection)) { // check if type object

                        // collection
                        const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

                        // remove object at index
                        if (idx >= 0) {
                            delete collection[idx];
                            const modified = collection.filter(e => { return e ? true : false });

                            // add to temp collection
                            tmpCollection[key] = modified;
                        }
                    }

                    this.#mapDataUpdate(tmpCollection, parentKey, childKeys, r[0] === 1);
                } else {
                    // add to temp collection
                    tmpCollection[key] = collection;
                }
            }
        } catch (error) {
            throw error;
        }
    }

    // map data and update collection
    #mapDataUpdate(tmpCollection, parentKey, childKeys, isEncoded) {

        let newCollection = null;

        for (const [idx, key] of childKeys.reverse().entries()) { // iterate from last key path first

            let data = tmpCollection[key];

            if (!newCollection) {
                newCollection = { [key]: data }; // set initial value
            } else {

                // update with old data + new data
                newCollection = {
                    [key]: this.combineObject(newCollection, data)
                }
            }

            if (idx === childKeys.length - 1) {
                // add modified data to the parent collection
                newCollection = this.combineObject(newCollection, r[1]);

                // save and update local
                return this.setItem(parentKey, newCollection, isEncoded);
            }
        }
    }

    /**
     *
     * @param {string} key - key name of your saved data
     *
     */
    getItem(key) {

        try {
            const data = this.#storage.getItem(key);
            const r = this.isDataEncoded(data);

            return r[1];
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {object} data - data to be validated
     * @return {object[]} - [0] status, [1] data
     *
     */
    isDataEncoded(data) {

        let d = this.decode(data);

        if (d) {
            return [1, d];
        } else if (data && data.startsWith('{') && data.endsWith('}')) {
            d = JSON.parse(data);
            return [0, d];
        } else {
            return [-1, null];
        }
    }

    /**
     *
     * @param {string[]} keys - key names of your saved data
     *
     */
    getMultiple(keys) {

        try {
            const items = [];

            for (const key of keys) {
                const data = this.#storage.getItem(key);
                const r = this.isDataEncoded(data);

                if (r[1]) {
                    items.push(r[1]);
                }
            }

            return items;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {string} key - key name of your saved data
     *
     */
    removeItem(key) {

        try {
            this.#storage.removeItem(key);

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {string[]} keys - key names of your saved data
     *
     */
    removeMultiple(keys) {

        try {
            for (const key of keys) {
                this.#storage.removeItem(key);
            }

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * will check if there's saved data under this domain
     * @param {string} key - key names of your saved data
     */
    hasData(key) {

        try {
            const data = this.#storage.getItem(key);

            return data;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * will purge all saved data under this domain
     *
     */
    purge() {

        try {
            this.#storage.clear();

            return true;
        } catch (error) {
            throw error;
        }
    }

    /**
     *
     * @param {Object} obj - object to be encoded
     *
     */
    encode(obj) {

        const rawStr = JSON.stringify(obj);
        const encodeURI = encodeURIComponent(rawStr);
        const unescapedURI = unescape(encodeURI);
        const encObj = window.btoa(unescapedURI);

        // console.log('encoded: ', encObj);
        return encObj;
    }

    /**
     *
     * @param {Object} encObj - object to be decoded
     *
     */
    decode(encObj) {

        if (!encObj || typeof encObj !== 'string') return null;

        try {
            const decoded = window.atob(encObj);
            const obj = JSON.parse(decoded);

            // console.log('decoded: ', obj);

            return obj;
        } catch (error) {
            // console.log('decoded error: ', error);

            return null;
        }
    }
}