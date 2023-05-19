"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStorage = void 0;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.string.starts-with.js");
require("core-js/modules/es.string.ends-with.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/es.array.reverse.js");
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _storage = /*#__PURE__*/new WeakMap();
var _mapDataUpdate = /*#__PURE__*/new WeakSet();
class WebStorage {
  constructor(storage) {
    // map data and update collection
    _classPrivateMethodInitSpec(this, _mapDataUpdate);
    _classPrivateFieldInitSpec(this, _storage, {
      writable: true,
      value: null
    });
    _classPrivateFieldSet(this, _storage, storage);
  }
  length() {
    return _classPrivateFieldGet(this, _storage).length;
  }
  key(index) {
    return _classPrivateFieldGet(this, _storage).key(index);
  }

  /**
   *
   * @param {string} key - data key
   * @param {*} value - data value
   *
   */
  setItem(key, value) {
    var encoded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    try {
      var d = encoded ? this.encode(value) : JSON.stringify(value);
      _classPrivateFieldGet(this, _storage).setItem(key, d);
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
      for (var i of items) {
        var d = encoded ? this.encode(i.value) : JSON.stringify(i.value);
        _classPrivateFieldGet(this, _storage).setItem(i.key, d);
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
      var data = _classPrivateFieldGet(this, _storage).getItem(key);
      var r = this.isDataEncoded(data);
      var collection = r[1];
      if (!collection) return; // return as we don't know what format the data should be saved

      var newData = this.combineObject(value, collection);
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
    for (var key in object) {
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
    for (var i = 0; i < collection.length; i++) {
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
      var keys = keyPath.split(".");
      var parentKey = keys.shift();
      var data = _classPrivateFieldGet(this, _storage).getItem(parentKey);
      var r = this.isDataEncoded(data);
      var collection = r[1]; // get old collection
      if (!collection) return false; // terminate process

      var tmpCollection = {};
      var childKeys = keys.map(k => k.trim());

      // iterate through with child keys
      for (var [idx, key] of childKeys.entries()) {
        if (!collection) return false; // terminate on key not found

        collection = collection[key]; // map data get value from key path

        if (idx === childKeys.length - 1) {
          if (!Array.isArray(collection)) {
            // check if type object
            collection = value; // replace with new value
          } else {
            // collection
            var _idx = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

            // append or replace object at index
            if (_idx >= 0) {
              collection[_idx] = value;
            } else {
              collection.push(value);
            }
          }

          // add to temp collection
          tmpCollection[key] = collection;
          _classPrivateMethodGet(this, _mapDataUpdate, _mapDataUpdate2).call(this, tmpCollection, parentKey, childKeys, r[1], r[0] === 1);
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
      var keys = keyPath.split(".");
      var parentKey = keys.shift();
      var collection = this.getItem(parentKey);
      if (!collection) return false; // terminate process

      var childKeys = keys.map(k => k.trim());

      // iterate through with child keys
      for (var [idx, key] of childKeys.entries()) {
        if (!collection) return false; // terminate on key not found

        collection = collection[key]; // map data get value from key path

        if (idx === childKeys.length - 1) {
          if (!Array.isArray(collection)) {
            // check if type object
            return collection; // return value
          } else {
            // collection
            var _idx2 = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

            // return value
            if (_idx2 >= 0) {
              return collection[_idx2];
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
      var keys = keyPath.split(".");
      var parentKey = keys.shift();
      var data = _classPrivateFieldGet(this, _storage).getItem(parentKey);
      var r = this.isDataEncoded(data);
      var collection = r[1];
      if (!collection) return false; // terminate process

      var tmpCollection = {};
      var childKeys = keys.map(k => k.trim());

      // iterate through with child keys
      for (var [idx, key] of childKeys.entries()) {
        if (!collection) return false; // terminate on key not found

        collection = collection[key]; // map data get value from key path

        if (idx === childKeys.length - 1) {
          if (Array.isArray(collection)) {
            // check if type object

            // collection
            var _idx3 = attrCompare ? this.indexOfObject(collection, value, attrCompare) : -1;

            // remove object at index
            if (_idx3 >= 0) {
              delete collection[_idx3];
              var modified = collection.filter(e => {
                return e ? true : false;
              });

              // add to temp collection
              tmpCollection[key] = modified;
            }
          }
          _classPrivateMethodGet(this, _mapDataUpdate, _mapDataUpdate2).call(this, tmpCollection, parentKey, childKeys, r[1], r[0] === 1);
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
   * @param {string} key - key name of your saved data
   *
   */
  getItem(key) {
    try {
      var data = _classPrivateFieldGet(this, _storage).getItem(key);
      var r = this.isDataEncoded(data);
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
    var d = this.decode(data);
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
      var items = [];
      for (var key of keys) {
        var data = _classPrivateFieldGet(this, _storage).getItem(key);
        var r = this.isDataEncoded(data);
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
      _classPrivateFieldGet(this, _storage).removeItem(key);
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
      for (var key of keys) {
        _classPrivateFieldGet(this, _storage).removeItem(key);
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
      var data = _classPrivateFieldGet(this, _storage).getItem(key);
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
      _classPrivateFieldGet(this, _storage).clear();
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
    var rawStr = JSON.stringify(obj);
    var encodeURI = encodeURIComponent(rawStr);
    var unescapedURI = unescape(encodeURI);
    var encObj = window.btoa(unescapedURI);

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
      var decoded = window.atob(encObj);
      var obj = JSON.parse(decoded);

      // console.log('decoded: ', obj);

      return obj;
    } catch (error) {
      // console.log('decoded error: ', error);

      return null;
    }
  }
}
exports.WebStorage = WebStorage;
function _mapDataUpdate2(tmpCollection, parentKey, childKeys, sourceData, isEncoded) {
  var newCollection = null;
  for (var [idx, key] of childKeys.reverse().entries()) {
    // iterate from last key path first

    var data = tmpCollection[key];
    if (!newCollection) {
      newCollection = {
        [key]: data
      }; // set initial value
    } else {
      // update with old data + new data
      newCollection = {
        [key]: this.combineObject(newCollection, data)
      };
    }
    if (idx === childKeys.length - 1) {
      // add modified data to the parent collection
      newCollection = this.combineObject(newCollection, sourceData);

      // save and update local
      return this.setItem(parentKey, newCollection, isEncoded);
    }
  }
}