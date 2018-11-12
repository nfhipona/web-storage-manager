const storage = window.localStorage

exports.storage = () => {
    return storage
}

/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */
exports.setItem = (key, value) => {

    try {
        storage.setItem(key, JSON.stringify(value))
        return true
    } catch (error) {
        return false
    }
}

/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */
exports.setEncodeItem = (key, value) => {

    try {
        const encoded = this.encode(value)
        console.log('encoded: ', encoded)
        storage.setItem(key, encoded)
        return true
    } catch (error) {
        console.log('encoded error: ', error)
        throw new Error('Unable to encode and save data')
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
exports.setMultiple = (items) => {

    try {
        for (const i of items) {
            storage.setItem(i.key, JSON.stringify(i.value))
        }

        return true
    } catch (error) {
        return false
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
exports.setEncodeMultiple = (items) => {

    try {
        for (const i of items) {
            const encoded = this.encode(i.value)
            storage.setItem(i.key, encoded)
        }

        return true
    } catch (error) {
        console.log('encoded error: ', error)
        return false
    }
}

/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */
exports.appendItem = (key, value) => {

    try {
        const oldData = this.getItem(key)
        const newData = this.combineObject(value, oldData)

        return this.setItem(key, newData)
    } catch (error) {
        return false
    }
}

/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */
exports.appendEncodeItem = (key, value) => {

    try {
        const oldData = this.getEncodeItem(key)
        const newData = this.combineObject(value, oldData)

        return this.setEncodeItem(key, newData)
    } catch (error) {
        console.log('encoded error: ', error)
        return false
    }
}

/**
 *
 * @param {Object} object - object to combine
 * @param {Object} toObject - object to combine to
 *
 */
exports.combineObject = (object, toObject) => {

    for (const key in object) {
        toObject[key] = object[key]
    }

    return toObject
}

/**
 *
 * @param {Object[]} collection - collection of objects
 * @param {Object} object - object to find index from the collection
 * @param {string} attr - attribute of the object to compare to
 *
 */
exports.indexOfObject = (collection, object, attr) => {

    for (let i = 0; i < collection.length; i++) {
        if (collection[i][attr] === object[attr]) {
            return i
        }
    }

    return -1
}

/**
 *
 * @param {string} parentKey - parent data key
 * @param {string[]} childKeys - data keys - key path
 * @param {string} value - data value
 * @param {string} value - data attrib compare
 *
 */
exports.updateItemInItem = (parentKey, childKeys, value, attrCompare) => {

    try {
        let collection = this.getItem(parentKey)
        if (!collection) return false // terminate process

        let tmpCollection = {}

        // iterate through with child keys
        for (const [idx, key] of childKeys.entries()) {
            collection = mapData(key, collection)

            if (idx === childKeys.length - 1) {

                if (!Array.isArray(collection)) { // check if type object
                    collection = value // replace with new value
                }else{
                    // collection
                    const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1

                    // append or replace object at index
                    if (idx >= 0) {
                        collection[idx] = value
                    }else{
                        collection.push(value)
                    }
                }

                // add to temp collection
                tmpCollection[key] = collection
                mapDataUpdate(this, tmpCollection)
            }else{
                // add to temp collection
                tmpCollection[key] = collection
            }
        }

        // map data get value from key path
        function mapData(key, collection) {

            return collection[key]
        }

        // map data and update collection
        function mapDataUpdate(self, tmpCollection) {

            const objSelf = Object(self) // set self
            const oldCollection = objSelf.getItem(parentKey) // get old collection
            let newCollection = null

            for (const [idx, key] of childKeys.reverse().entries()) { // iterate from last key path first

                let data = tmpCollection[key]

                if (!newCollection) {
                    newCollection = { [key]: data } // set initial value
                }else{

                    // update with old data + new data
                    newCollection = {
                        [key]: objSelf.combineObject(newCollection, data)
                    }
                }

                if (idx === childKeys.length - 1) {
                    // add modified data to the parent collection
                    newCollection = objSelf.combineObject(newCollection, oldCollection)

                    // save and update local
                    return objSelf.setItem(parentKey, newCollection)
                }
            }
        }

    } catch (error) {
        return false
    }
}

/**
 *
 * @param {string} parentKey - parent data key
 * @param {string[]} childKeys - data keys - key path
 * @param {string} value - data value
 * @param {string} value - data attrib compare
 *
 */
exports.updateEncodeItemInItem = (parentKey, childKeys, value, attrCompare) => { // use only for encoded objects

    try {
        let collection = this.getEncodeItem(parentKey)
        if (!collection) return false // terminate process

        let tmpCollection = {}

        // iterate through with child keys
        for (const [idx, key] of childKeys.entries()) {
            collection = mapData(key, collection)

            if (idx === childKeys.length - 1) {

                if (!Array.isArray(collection)) { // check if type object
                    collection = value // replace with new value
                }else{
                    // collection
                    const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1

                    // append or replace object at index
                    if (idx >= 0) {
                        collection[idx] = value
                    }else{
                        collection.push(value)
                    }
                }

                // add to temp collection
                tmpCollection[key] = collection
                mapDataUpdate(this, tmpCollection)
            }else{
                // add to temp collection
                tmpCollection[key] = collection
            }
        }

        // map data get value from key path
        function mapData(key, collection) {

            return collection[key]
        }

        // map data and update collection
        function mapDataUpdate(self, tmpCollection) {

            const objSelf = Object(self) // set self
            const oldCollection = objSelf.getEncodeItem(parentKey) // get old collection
            let newCollection = null

            for (const [idx, key] of childKeys.reverse().entries()) { // iterate from last key path first

                let data = tmpCollection[key]

                if (!newCollection) {
                    newCollection = { [key]: data } // set initial value
                }else{

                    // update with old data + new data
                    newCollection = {
                        [key]: objSelf.combineObject(newCollection, data)
                    }
                }

                if (idx === childKeys.length - 1) {
                    // add modified data to the parent collection
                    newCollection = objSelf.combineObject(newCollection, oldCollection)

                    // save and update local
                    return objSelf.setEncodeItem(parentKey, newCollection)
                }
            }
        }

    } catch (error) {
        console.log('encoded error: ', error)
        return false
    }
}

/**
 *
 * @param {string} key - key name of your saved data
 *
 */
exports.getItem = (key) => {

    try {
        const data = storage.getItem(key)
        return JSON.parse(data)

    } catch (error) {
        return null
    }
}

/**
 *
 * @param {string} key - key name of your saved data
 *
 */
exports.getEncodeItem = (key) => {

    try {
        const data = storage.getItem(key)
        const decoded = this.decode(data)

        return decoded

    } catch (error) {
        console.log('encoded error: ', error)
        return null
    }
}

/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */
exports.getMultiple = (keys) => {

    try {
        const items = []

        for (const key of keys) {
            const data = storage.getItem(key)
            const item = JSON.parse(data)

            if (item) {
                items.push(item)
            }
        }

        return items
    } catch (error) {
        console.log('encoded error: ', error)
        return null
    }
}

/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */
exports.getEncodeMultiple = (keys) => {

    try {
        const items = []

        for (const key of keys) {
            const data = storage.getItem(key)
            const decoded = this.decode(data)

            if (decoded) {
                items.push(decoded)
            }
        }

        return items
    } catch (error) {
        console.log('encoded error: ', error)
        return null
    }
}

/**
 *
 * @param {string} key - key name of your saved data
 *
 */
exports.removeItem = (key) => {

    try {
        storage.removeItem(key)
        return true
    } catch (error) {
        return false
    }
}

/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */
exports.removeMultiple = (keys) => {

    try {
        for (const key of keys) {
            storage.removeItem(key)
        }

        return true
    } catch (error) {
        return false
    }
}

/**
 *
 * will purge all saved data under this domain
 *
 */
exports.purge = () => {

    try {
        storage.clear()
        return true
    } catch (error) {
        return false
    }
}

/**
 *
 * @param {Object} obj - object to be encoded
 *
 */
exports.encode = (obj) => {

    const rawStr = JSON.stringify(obj)
    const encObj = window.btoa(rawStr)

    return encObj
}

/**
 *
 * @param {Object} encObj - object to be decoded
 *
 */
exports.decode = (encObj) => {

    const decoded = window.atob(encObj)
    const obj = JSON.parse(decoded)

    return obj
}