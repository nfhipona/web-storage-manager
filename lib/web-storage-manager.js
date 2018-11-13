require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/web.dom.iterable");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const storage = window.localStorage;

exports.storage = () => {
  return storage;
};
/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */


exports.setItem = (key, value) => {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */


exports.setEncodeItem = (key, value) => {
  try {
    const encoded = this.encode(value);
    storage.setItem(key, encoded);
    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {Object[]} items - collection
 * @param {Object} items[].item - item object
 * @param {string} items[].item.key - data key
 * @param {*} items[].item.value - data value
 *
 */


exports.setMultiple = items => {
  try {
    for (const i of items) {
      storage.setItem(i.key, JSON.stringify(i.value));
    }

    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {Object[]} items - collection
 * @param {Object} items[].item - item object
 * @param {string} items[].item.key - data key
 * @param {*} items[].item.value - data value
 *
 */


exports.setEncodeMultiple = items => {
  try {
    for (const i of items) {
      const encoded = this.encode(i.value);
      storage.setItem(i.key, encoded);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */


exports.appendItem = (key, value) => {
  try {
    const oldData = this.getItem(key);
    const newData = this.combineObject(value, oldData);
    return this.setItem(key, newData);
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - data key
 * @param {*} value - data value
 *
 */


exports.appendEncodeItem = (key, value) => {
  try {
    const oldData = this.getEncodeItem(key);
    const newData = this.combineObject(value, oldData);
    return this.setEncodeItem(key, newData);
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {Object} object - object to combine
 * @param {Object} toObject - object to combine to
 *
 */


exports.combineObject = (object, toObject) => {
  for (const key in object) {
    toObject[key] = object[key];
  }

  return toObject;
};
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
      return i;
    }
  }

  return -1;
};
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
    let collection = this.getItem(parentKey);
    if (!collection) return false; // terminate process

    let tmpCollection = {}; // iterate through with child keys

    for (const _ref of childKeys.entries()) {
      var _ref2 = _slicedToArray(_ref, 2);

      const idx = _ref2[0];
      const key = _ref2[1];
      collection = mapData(key, collection);

      if (idx === childKeys.length - 1) {
        if (!Array.isArray(collection)) {
          // check if type object
          collection = value; // replace with new value
        } else {
          // collection
          const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1; // append or replace object at index

          if (idx >= 0) {
            collection[idx] = value;
          } else {
            collection.push(value);
          }
        } // add to temp collection


        tmpCollection[key] = collection;
        mapDataUpdate(this, tmpCollection);
      } else {
        // add to temp collection
        tmpCollection[key] = collection;
      }
    } // map data get value from key path


    function mapData(key, collection) {
      return collection[key];
    } // map data and update collection


    function mapDataUpdate(self, tmpCollection) {
      const objSelf = Object(self); // set self

      const oldCollection = objSelf.getItem(parentKey); // get old collection

      let newCollection = null;

      for (const _ref3 of childKeys.reverse().entries()) {
        var _ref4 = _slicedToArray(_ref3, 2);

        const idx = _ref4[0];
        const key = _ref4[1];
        // iterate from last key path first
        let data = tmpCollection[key];

        if (!newCollection) {
          newCollection = {
            [key]: data // set initial value

          };
        } else {
          // update with old data + new data
          newCollection = {
            [key]: objSelf.combineObject(newCollection, data)
          };
        }

        if (idx === childKeys.length - 1) {
          // add modified data to the parent collection
          newCollection = objSelf.combineObject(newCollection, oldCollection); // save and update local

          return objSelf.setItem(parentKey, newCollection);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} parentKey - parent data key
 * @param {string[]} childKeys - data keys - key path
 * @param {string} value - data value
 * @param {string} value - data attrib compare
 *
 */


exports.updateEncodeItemInItem = (parentKey, childKeys, value, attrCompare) => {
  // use only for encoded objects
  try {
    let collection = this.getEncodeItem(parentKey);
    if (!collection) return false; // terminate process

    let tmpCollection = {}; // iterate through with child keys

    for (const _ref5 of childKeys.entries()) {
      var _ref6 = _slicedToArray(_ref5, 2);

      const idx = _ref6[0];
      const key = _ref6[1];
      collection = mapData(key, collection);

      if (idx === childKeys.length - 1) {
        if (!Array.isArray(collection)) {
          // check if type object
          collection = value; // replace with new value
        } else {
          // collection
          const idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1; // append or replace object at index

          if (idx >= 0) {
            collection[idx] = value;
          } else {
            collection.push(value);
          }
        } // add to temp collection


        tmpCollection[key] = collection;
        mapDataUpdate(this, tmpCollection);
      } else {
        // add to temp collection
        tmpCollection[key] = collection;
      }
    } // map data get value from key path


    function mapData(key, collection) {
      return collection[key];
    } // map data and update collection


    function mapDataUpdate(self, tmpCollection) {
      const objSelf = Object(self); // set self

      const oldCollection = objSelf.getEncodeItem(parentKey); // get old collection

      let newCollection = null;

      for (const _ref7 of childKeys.reverse().entries()) {
        var _ref8 = _slicedToArray(_ref7, 2);

        const idx = _ref8[0];
        const key = _ref8[1];
        // iterate from last key path first
        let data = tmpCollection[key];

        if (!newCollection) {
          newCollection = {
            [key]: data // set initial value

          };
        } else {
          // update with old data + new data
          newCollection = {
            [key]: objSelf.combineObject(newCollection, data)
          };
        }

        if (idx === childKeys.length - 1) {
          // add modified data to the parent collection
          newCollection = objSelf.combineObject(newCollection, oldCollection); // save and update local

          return objSelf.setEncodeItem(parentKey, newCollection);
        }
      }
    }
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - key name of your saved data
 *
 */


exports.getItem = key => {
  try {
    const data = storage.getItem(key);
    return JSON.parse(data);
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - key name of your saved data
 *
 */


exports.getEncodeItem = key => {
  try {
    const data = storage.getItem(key);
    const decoded = this.decode(data);
    return decoded;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */


exports.getMultiple = keys => {
  try {
    const items = [];

    for (const key of keys) {
      const data = storage.getItem(key);
      const item = JSON.parse(data);

      if (item) {
        items.push(item);
      }
    }

    return items;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */


exports.getEncodeMultiple = keys => {
  try {
    const items = [];

    for (const key of keys) {
      const data = storage.getItem(key);
      const decoded = this.decode(data);

      if (decoded) {
        items.push(decoded);
      }
    }

    return items;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string} key - key name of your saved data
 *
 */


exports.removeItem = key => {
  try {
    storage.removeItem(key);
    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {string[]} keys - key names of your saved data
 *
 */


exports.removeMultiple = keys => {
  try {
    for (const key of keys) {
      storage.removeItem(key);
    }

    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * will purge all saved data under this domain
 *
 */


exports.purge = () => {
  try {
    storage.clear();
    return true;
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {Object} obj - object to be encoded
 *
 */


exports.encode = obj => {
  const rawStr = JSON.stringify(obj);
  const encObj = window.btoa(rawStr);
  console.log('encoded: ', encObj);
  return encObj;
};
/**
 *
 * @param {Object} encObj - object to be decoded
 *
 */


exports.decode = encObj => {
  if (!encObj || typeof encObj !== 'string') return null;

  try {
    const decoded = window.atob(encObj);
    const obj = JSON.parse(decoded);
    console.log('decoded: ', obj);
    return obj;
  } catch (error) {
    console.log('decoded error: ', error);
    return null;
  }
};