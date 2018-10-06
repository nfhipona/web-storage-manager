const storage = window.localStorage

exports.storage = () => {
    storage
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
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */
exports.appendItem = (key, value) => {

    try {
        const oldData = this.getItem(key)

        let newData = this.combineObject(value, oldData);
        this.setItem(key, newData)

        return true
    } catch (error) {
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
                    objSelf.setItem(parentKey, newCollection)

                    return true
                }
            }
        }

    } catch (error) {
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
        return null
    }
}

/**
 *
 * @param {string} key - key name of your saved data
 *
 */
removeItem = (key) => {

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
removeMultiple = (keys) => {

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
purge = () => {

    try {
        storage.clear()
        return true
    } catch (error) {
        return false
    }
}