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


exports.setItem = (key, value, encoded) => {
  try {
    const d = encoded ? exports.encode(value) : JSON.stringify(value);
    storage.setItem(key, d);
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


exports.setMultiple = (items, encoded) => {
  try {
    for (const i of items) {
      const d = encoded ? exports.encode(i.value) : JSON.stringify(i.value);
      storage.setItem(i.key, d);
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
    const data = storage.getItem(key);
    const r = exports.isDataEncoded(data);
    const collection = r[1];
    if (!collection) return; // return as we don't know what format the data should be saved

    const newData = exports.combineObject(value, collection);
    return exports.setItem(key, newData, r[0] === 1);
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
  if (!object) return -1;

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
 * @param {string} attrCompare - data attrib compare
 *
 */


exports.updateItemInItem = (parentKey, childKeys, value, attrCompare) => {
  try {
    const data = storage.getItem(parentKey);
    const r = exports.isDataEncoded(data);
    let collection = r[1]; // get old collection

    if (!collection) return false; // terminate process

    let tmpCollection = {};
    childKeys = childKeys.map(k => k.trim()); // iterate through with child keys

    for (const _ref of childKeys.entries()) {
      var _ref2 = _slicedToArray(_ref, 2);

      const idx = _ref2[0];
      const key = _ref2[1];
      if (!collection) return false; // terminate on key not found

      collection = collection[key]; // map data get value from key path

      if (idx === childKeys.length - 1) {
        if (!Array.isArray(collection)) {
          // check if type object
          collection = value; // replace with new value
        } else {
          // collection
          const idx = attrCompare ? exports.indexOfObject(collection, value, attrCompare) : -1; // append or replace object at index

          if (idx >= 0) {
            collection[idx] = value;
          } else {
            collection.push(value);
          }
        } // add to temp collection


        tmpCollection[key] = collection;
        mapDataUpdate(tmpCollection);
      } else {
        // add to temp collection
        tmpCollection[key] = collection;
      }
    } // map data and update collection


    function mapDataUpdate(tmpCollection) {
      let newCollection = null;

      for (const _ref3 of childKeys.reverse().entries()) {
        var _ref4 = _slicedToArray(_ref3, 2);

        const idx = _ref4[0];
        const key = _ref4[1];
        // iterate from last key path first
        let data = tmpCollection[key];

        if (!newCollection) {
          newCollection = {
            [key]: data
          }; // set initial value
        } else {
          // update with old data + new data
          newCollection = {
            [key]: exports.combineObject(newCollection, data)
          };
        }

        if (idx === childKeys.length - 1) {
          // add modified data to the parent collection
          newCollection = exports.combineObject(newCollection, r[1]); // save and update local

          return exports.setItem(parentKey, newCollection, r[0] === 1);
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
 * @param {string} attrCompare - data attrib compare
 *
 */


exports.getItemInItem = (parentKey, childKeys, value, attrCompare) => {
  try {
    let collection = exports.getItem(parentKey);
    if (!collection) return false; // terminate process

    childKeys = childKeys.map(k => k.trim()); // iterate through with child keys

    for (const _ref5 of childKeys.entries()) {
      var _ref6 = _slicedToArray(_ref5, 2);

      const idx = _ref6[0];
      const key = _ref6[1];
      if (!collection) return false; // terminate on key not found

      collection = collection[key]; // map data get value from key path

      if (idx === childKeys.length - 1) {
        if (!Array.isArray(collection)) {
          // check if type object
          return collection; // return value
        } else {
          // collection
          const idx = attrCompare ? exports.indexOfObject(collection, value, attrCompare) : -1; // return value

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
};
/**
 *
 * @param {string} parentKey - parent data key
 * @param {string[]} childKeys - data keys - key path
 * @param {string} value - data value
 * @param {string} attrCompare - data attrib compare
 *
 */


exports.removeItemInItem = (parentKey, childKeys, value, attrCompare) => {
  try {
    const data = storage.getItem(parentKey);
    const r = exports.isDataEncoded(data);
    let collection = r[1];
    if (!collection) return false; // terminate process

    let tmpCollection = {};
    childKeys = childKeys.map(k => k.trim()); // iterate through with child keys

    for (const _ref7 of childKeys.entries()) {
      var _ref8 = _slicedToArray(_ref7, 2);

      const idx = _ref8[0];
      const key = _ref8[1];
      if (!collection) return false; // terminate on key not found

      collection = collection[key]; // map data get value from key path

      if (idx === childKeys.length - 1) {
        if (Array.isArray(collection)) {
          // check if type object
          // collection
          const idx = attrCompare ? exports.indexOfObject(collection, value, attrCompare) : -1; // remove object at index

          if (idx >= 0) {
            delete collection[idx];
            c = collection.filter(e => {
              return e ? true : false;
            }); // add to temp collection

            tmpCollection[key] = c;
          }
        }

        mapDataUpdate(tmpCollection);
      } else {
        // add to temp collection
        tmpCollection[key] = collection;
      }
    } // map data and update collection


    function mapDataUpdate(tmpCollection) {
      let newCollection = null;

      for (const _ref9 of childKeys.reverse().entries()) {
        var _ref10 = _slicedToArray(_ref9, 2);

        const idx = _ref10[0];
        const key = _ref10[1];
        // iterate from last key path first
        let data = tmpCollection[key];

        if (!newCollection) {
          newCollection = {
            [key]: data
          }; // set initial value
        } else {
          // update with old data + new data
          newCollection = {
            [key]: exports.combineObject(newCollection, data)
          };
        }

        if (idx === childKeys.length - 1) {
          // add modified data to the parent collection
          newCollection = exports.combineObject(newCollection, r[1]); // save and update local

          return exports.setItem(parentKey, newCollection, r[0] === 1);
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
    const r = exports.isDataEncoded(data);
    return r[1];
  } catch (error) {
    throw error;
  }
};
/**
 *
 * @param {object} data - data to be validated
 * @return {object[]} - [0] status, [1] data
 *
 */


exports.isDataEncoded = data => {
  let d = exports.decode(data);

  if (d) {
    return [1, d];
  } else if (data && data.startsWith('{') && data.endsWith('}')) {
    d = JSON.parse(data);
    return [0, d];
  } else {
    return [-1, null];
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
      const r = exports.isDataEncoded(data);

      if (r[1]) {
        items.push(r[1]);
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
 * will check if there's saved data under this domain
 * @param {string} key - key names of your saved data
 */


exports.hasData = key => {
  try {
    const data = storage.getItem(key);
    return data;
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
  const encodeURI = encodeURIComponent(rawStr);
  const unescapedURI = unescape(encodeURI);
  const encObj = window.btoa(unescapedURI); // console.log('encoded: ', encObj);

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
    const obj = JSON.parse(decoded); // console.log('decoded: ', obj);

    return obj;
  } catch (error) {
    // console.log('decoded error: ', error);
    return null;
  }
};