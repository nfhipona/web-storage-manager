"use strict";

require("core-js/modules/es.symbol.description.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WebStore = void 0;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/web.dom-collections.iterator.js");
require("core-js/modules/es.regexp.exec.js");
require("core-js/modules/es.string.split.js");
require("core-js/modules/es.string.trim.js");
require("core-js/modules/es.weak-map.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _storage = /*#__PURE__*/new WeakMap();
var _indexOfObject = /*#__PURE__*/new WeakSet();
class WebStore {
  /**
   * 
   * @param storage Storage interface to be used and initialized.
   */
  constructor(storage) {
    var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
    /**
     * Helpers
     */
    /**
     * Find and returns index of the target item
     * @param {Object[]} sourceData - collection of objects
     * @param {AttributeCompare} attrCompare - object to find index from the collection
     * @returns {number} index of found matching item
     */
    _classPrivateMethodInitSpec(this, _indexOfObject);
    /**
     * Web store to be used for this session.
     */
    _classPrivateFieldInitSpec(this, _storage, {
      writable: true,
      value: void 0
    });
    _defineProperty(this, "delimiter", void 0);
    _classPrivateFieldSet(this, _storage, storage);
    this.delimiter = delimiter;
  }
  get length() {
    return _classPrivateFieldGet(this, _storage).length;
  }
  key(n) {
    return _classPrivateFieldGet(this, _storage).key(n);
  }
  getItem(key) {
    var stringified = _classPrivateFieldGet(this, _storage).getItem(key);
    var converted = JSON.parse(stringified);
    return converted;
  }
  setItem(key, value) {
    try {
      var stringified = JSON.stringify(value);
      _classPrivateFieldGet(this, _storage).setItem(key, stringified);
      return true;
    } catch (error) {
      throw error;
    }
  }
  removeItem(key) {
    _classPrivateFieldGet(this, _storage).removeItem(key);
  }
  clear() {
    _classPrivateFieldGet(this, _storage).clear();
  }
  appendItem(key, value) {
    try {
      var data = this.getItem(key);
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
  setMultipleItems(items) {
    try {
      for (var item of items) {
        var stringified = JSON.stringify(item.value);
        _classPrivateFieldGet(this, _storage).setItem(item.key, stringified);
      }
      return true;
    } catch (error) {
      throw error;
    }
  }
  removeMultipleItems(keys) {
    for (var key of keys) {
      _classPrivateFieldGet(this, _storage).removeItem(key);
    }
  }
  getMultipleItems(keys) {
    var items = [];
    for (var key of keys) {
      var item = this.getItem(key);
      if (item) {
        items.push(item);
      }
    }
    return items;
  }
  appendItemInItem(key, value) {
    try {
      var keyPaths = key.split(this.delimiter);
      var parentKey = keyPaths.shift();
      var childKeys = keyPaths.map(k => k.trim());
      var data = this.getItem(parentKey);
      if (!data) {
        return new Error('Key not found');
      }
      var sourceData = data;
      for (var [idx, childKey] of childKeys.entries()) {
        sourceData = sourceData[childKey];
        if (!sourceData) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKey.length - 1) {
          if (Array.isArray(sourceData)) {
            sourceData.push(value);
          } else if (typeof sourceData === 'object' && typeof value === 'object') {
            sourceData[childKey] = _objectSpread(_objectSpread({}, sourceData), value);
          }
        }
      }
      return this.setItem(parentKey, data);
      ;
    } catch (error) {
      throw error;
    }
  }
  updateItemInItem(key, value, attrCompare) {
    try {
      var keyPaths = key.split(this.delimiter);
      var parentKey = keyPaths.shift();
      var childKeys = keyPaths.map(k => k.trim());
      var data = this.getItem(parentKey);
      if (!data) {
        return new Error('Key not found');
      }
      var sourceData = data;
      for (var [idx, childKey] of childKeys.entries()) {
        sourceData = sourceData[childKey];
        if (!sourceData) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKey.length - 1) {
          if (Array.isArray(sourceData) && attrCompare) {
            var foundIdx = _classPrivateMethodGet(this, _indexOfObject, _indexOfObject2).call(this, sourceData, attrCompare);
            sourceData[foundIdx] = value;
          } else if (typeof sourceData === 'object' && typeof value === 'object') {
            sourceData[childKey] = _objectSpread(_objectSpread({}, sourceData), value);
          }
        }
      }
      return this.setItem(parentKey, data);
      ;
    } catch (error) {
      throw error;
    }
  }
  removeItemInItem(key, attrCompare) {
    try {
      var keyPaths = key.split(this.delimiter);
      var parentKey = keyPaths.shift();
      var childKeys = keyPaths.map(k => k.trim());
      var data = this.getItem(parentKey);
      if (!data) {
        return new Error('Key not found');
      }
      var sourceData = data;
      for (var [idx, childKey] of childKeys.entries()) {
        var sourceDataTmp = sourceData[childKey];
        if (!sourceDataTmp) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKey.length - 1) {
          if (Array.isArray(sourceDataTmp) && attrCompare) {
            var foundIdx = _classPrivateMethodGet(this, _indexOfObject, _indexOfObject2).call(this, sourceDataTmp, attrCompare);
            sourceData[childKey].splice(foundIdx, 1);
          } else if (typeof sourceData === 'object') {
            delete sourceData[childKey];
          }
        } else {
          sourceData = sourceDataTmp;
        }
      }
      return this.setItem(parentKey, data);
      ;
    } catch (error) {
      throw error;
    }
  }
  getItemInItem(key) {
    var keyPaths = key.split(this.delimiter);
    var parentKey = keyPaths.shift();
    var childKeys = keyPaths.map(k => k.trim());
    var data = this.getItem(parentKey);
    if (!data) {
      return new Error('Key not found');
    }
    var sourceData = data;
    for (var childKey of childKeys) {
      if (!sourceData && !Array.isArray(sourceData)) {
        sourceData = sourceData[childKey];
      }
    }
    return sourceData;
  }
}
exports.WebStore = WebStore;
function _indexOfObject2(sourceData, attrCompare) {
  if (!Array.isArray(sourceData)) return -1;
  for (var [idx, data] of sourceData.entries()) {
    var targetValue = data[attrCompare.name];
    if (typeof attrCompare.value === 'number') {
      // check the type of searched value and try to compare with it's inherent type
      targetValue = Number(targetValue);
    }
    if (targetValue === attrCompare.value) {
      return idx;
    }
  }
  return -1;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXZWJTdG9yZSIsImNvbnN0cnVjdG9yIiwic3RvcmFnZSIsImRlbGltaXRlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIl9jbGFzc1ByaXZhdGVNZXRob2RJbml0U3BlYyIsIl9pbmRleE9mT2JqZWN0IiwiX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdFNwZWMiLCJfc3RvcmFnZSIsIndyaXRhYmxlIiwidmFsdWUiLCJfZGVmaW5lUHJvcGVydHkiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCJrZXkiLCJuIiwiZ2V0SXRlbSIsInN0cmluZ2lmaWVkIiwiY29udmVydGVkIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImVycm9yIiwicmVtb3ZlSXRlbSIsImNsZWFyIiwiYXBwZW5kSXRlbSIsImRhdGEiLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwic2V0TXVsdGlwbGVJdGVtcyIsIml0ZW1zIiwiaXRlbSIsInJlbW92ZU11bHRpcGxlSXRlbXMiLCJrZXlzIiwiZ2V0TXVsdGlwbGVJdGVtcyIsImFwcGVuZEl0ZW1Jbkl0ZW0iLCJrZXlQYXRocyIsInNwbGl0IiwicGFyZW50S2V5Iiwic2hpZnQiLCJjaGlsZEtleXMiLCJtYXAiLCJrIiwidHJpbSIsIkVycm9yIiwic291cmNlRGF0YSIsImlkeCIsImNoaWxkS2V5IiwiZW50cmllcyIsIl9vYmplY3RTcHJlYWQiLCJ1cGRhdGVJdGVtSW5JdGVtIiwiYXR0ckNvbXBhcmUiLCJmb3VuZElkeCIsIl9jbGFzc1ByaXZhdGVNZXRob2RHZXQiLCJfaW5kZXhPZk9iamVjdDIiLCJjYWxsIiwicmVtb3ZlSXRlbUluSXRlbSIsInNvdXJjZURhdGFUbXAiLCJzcGxpY2UiLCJnZXRJdGVtSW5JdGVtIiwiZXhwb3J0cyIsInRhcmdldFZhbHVlIiwibmFtZSIsIk51bWJlciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzcy9zdG9yYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXR0cmlidXRlQ29tcGFyZSxcbiAgICBLZXlQYXRoLFxuICAgIFN0b3JhZ2UsXG4gICAgU3RvcmFnZUl0ZW0sXG4gICAgU3RvcmFnZVZhbHVlLFxuICAgIFdlYlN0b3JhZ2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgV2ViU3RvcmUgaW1wbGVtZW50cyBXZWJTdG9yYWdlIHtcbiAgICAvKipcbiAgICAgKiBXZWIgc3RvcmUgdG8gYmUgdXNlZCBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqL1xuICAgICNzdG9yYWdlOiBTdG9yYWdlO1xuICAgIGRlbGltaXRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHN0b3JhZ2UgU3RvcmFnZSBpbnRlcmZhY2UgdG8gYmUgdXNlZCBhbmQgaW5pdGlhbGl6ZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSwgZGVsaW1pdGVyOiBzdHJpbmcgPSAnLicpIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N0b3JhZ2UubGVuZ3RoO1xuICAgIH1cblxuICAgIGtleShuOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy4jc3RvcmFnZS5rZXkobik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbShrZXk6IEtleVBhdGgpOiBTdG9yYWdlVmFsdWUge1xuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHRoaXMuI3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWQgPSBKU09OLnBhcnNlKHN0cmluZ2lmaWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZDtcbiAgICB9XG5cbiAgICBzZXRJdGVtKGtleTogS2V5UGF0aCwgdmFsdWU6IFN0b3JhZ2VWYWx1ZSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuI3N0b3JhZ2Uuc2V0SXRlbShrZXksIHN0cmluZ2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGtleTogS2V5UGF0aCk6IHZvaWQge1xuICAgICAgICB0aGlzLiNzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZS5jbGVhcigpO1xuICAgIH1cblxuXG4gICAgYXBwZW5kSXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShrZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNdWx0aXBsZUl0ZW1zKGl0ZW1zOiBTdG9yYWdlSXRlbVtdKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy4jc3RvcmFnZS5zZXRJdGVtKGl0ZW0ua2V5LCBzdHJpbmdpZmllZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlTXVsdGlwbGVJdGVtcyhrZXlzOiBLZXlQYXRoW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgdGhpcy4jc3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNdWx0aXBsZUl0ZW1zKGtleXM6IEtleVBhdGhbXSk6IFN0b3JhZ2VWYWx1ZVtdIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFN0b3JhZ2VWYWx1ZVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW0oa2V5KTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgYXBwZW5kSXRlbUluSXRlbShrZXk6IEtleVBhdGgsIHZhbHVlOiBhbnkpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZURhdGEgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcblxuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YS5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlRGF0YSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSB7IC4uLnNvdXJjZURhdGEsIC4uLnZhbHVlIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEl0ZW0ocGFyZW50S2V5LCBkYXRhKTs7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZUl0ZW1Jbkl0ZW0oa2V5OiBLZXlQYXRoLCB2YWx1ZTogYW55LCBhdHRyQ29tcGFyZT86IEF0dHJpYnV0ZUNvbXBhcmUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIHNvdXJjZURhdGEgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcblxuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJZHggPSB0aGlzLiNpbmRleE9mT2JqZWN0KHNvdXJjZURhdGEsIGF0dHJDb21wYXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbZm91bmRJZHhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZURhdGEgPT09ICdvYmplY3QnICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0geyAuLi5zb3VyY2VEYXRhLCAuLi52YWx1ZSB9O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRJdGVtKHBhcmVudEtleSwgZGF0YSk7O1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU6IEF0dHJpYnV0ZUNvbXBhcmUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZURhdGFUbXAgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcblxuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YVRtcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXkubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhVG1wKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJZHggPSB0aGlzLiNpbmRleE9mT2JqZWN0KHNvdXJjZURhdGFUbXAsIGF0dHJDb21wYXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldLnNwbGljZShmb3VuZElkeCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZURhdGEgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VEYXRhID0gc291cmNlRGF0YVRtcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEl0ZW0ocGFyZW50S2V5LCBkYXRhKTs7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEl0ZW1Jbkl0ZW0oa2V5OiBLZXlQYXRoKTogU3RvcmFnZVZhbHVlIHtcbiAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5ID0ga2V5UGF0aHMuc2hpZnQoKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGNoaWxkS2V5czogc3RyaW5nW10gPSBrZXlQYXRocy5tYXAoayA9PiBrLnRyaW0oKSk7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNvdXJjZURhdGE6IGFueSA9IGRhdGE7XG4gICAgICAgIGZvciAoY29uc3QgY2hpbGRLZXkgb2YgY2hpbGRLZXlzKSB7XG4gICAgICAgICAgICBpZiAoIXNvdXJjZURhdGEgJiYgIUFycmF5LmlzQXJyYXkoc291cmNlRGF0YSkpIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VEYXRhID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNvdXJjZURhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCBhbmQgcmV0dXJucyBpbmRleCBvZiB0aGUgdGFyZ2V0IGl0ZW1cbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBzb3VyY2VEYXRhIC0gY29sbGVjdGlvbiBvZiBvYmplY3RzXG4gICAgICogQHBhcmFtIHtBdHRyaWJ1dGVDb21wYXJlfSBhdHRyQ29tcGFyZSAtIG9iamVjdCB0byBmaW5kIGluZGV4IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiBmb3VuZCBtYXRjaGluZyBpdGVtXG4gICAgICovXG4gICAgI2luZGV4T2ZPYmplY3Qoc291cmNlRGF0YTogUmVjb3JkPHN0cmluZywgYW55PltdLCBhdHRyQ29tcGFyZTogQXR0cmlidXRlQ29tcGFyZSk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhKSkgcmV0dXJuIC0xO1xuICAgICAgICBmb3IgKGNvbnN0IFtpZHgsIGRhdGFdIG9mIHNvdXJjZURhdGEuZW50cmllcygpKSB7XG4gICAgICAgICAgICBsZXQgdGFyZ2V0VmFsdWUgPSBkYXRhW2F0dHJDb21wYXJlLm5hbWVdO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyQ29tcGFyZS52YWx1ZSA9PT0gJ251bWJlcicpIHsgLy8gY2hlY2sgdGhlIHR5cGUgb2Ygc2VhcmNoZWQgdmFsdWUgYW5kIHRyeSB0byBjb21wYXJlIHdpdGggaXQncyBpbmhlcmVudCB0eXBlXG4gICAgICAgICAgICAgICAgdGFyZ2V0VmFsdWUgPSBOdW1iZXIodGFyZ2V0VmFsdWUpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGFyZ2V0VmFsdWUgPT09IGF0dHJDb21wYXJlLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGlkeDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxufSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFTTyxNQUFNQSxRQUFRLENBQXVCO0VBT3hDO0FBQ0o7QUFDQTtBQUNBO0VBQ0lDLFdBQVdBLENBQUNDLE9BQWdCLEVBQTJCO0lBQUEsSUFBekJDLFNBQWlCLEdBQUFDLFNBQUEsQ0FBQUMsTUFBQSxRQUFBRCxTQUFBLFFBQUFFLFNBQUEsR0FBQUYsU0FBQSxNQUFHLEdBQUc7SUE4TXJEO0FBQ0o7QUFDQTtJQUVJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtJQUxJRywyQkFBQSxPQUFBQyxjQUFBO0lBNU5BO0FBQ0o7QUFDQTtJQUZJQywwQkFBQSxPQUFBQyxRQUFBO01BQUFDLFFBQUE7TUFBQUMsS0FBQTtJQUFBO0lBQUFDLGVBQUE7SUFXSUMscUJBQUEsS0FBSSxFQUFBSixRQUFBLEVBQVlSLE9BQU87SUFDdkIsSUFBSSxDQUFDQyxTQUFTLEdBQUdBLFNBQVM7RUFDOUI7RUFFQSxJQUFJRSxNQUFNQSxDQUFBLEVBQVc7SUFDakIsT0FBT1UscUJBQUEsS0FBSSxFQUFBTCxRQUFBLEVBQVVMLE1BQU07RUFDL0I7RUFFQVcsR0FBR0EsQ0FBQ0MsQ0FBUyxFQUFVO0lBQ25CLE9BQU9GLHFCQUFBLEtBQUksRUFBQUwsUUFBQSxFQUFVTSxHQUFHLENBQUNDLENBQUMsQ0FBQztFQUMvQjtFQUVBQyxPQUFPQSxDQUFDRixHQUFZLEVBQWdCO0lBQ2hDLElBQU1HLFdBQVcsR0FBR0oscUJBQUEsS0FBSSxFQUFBTCxRQUFBLEVBQVVRLE9BQU8sQ0FBQ0YsR0FBRyxDQUFDO0lBQzlDLElBQU1JLFNBQVMsR0FBR0MsSUFBSSxDQUFDQyxLQUFLLENBQUNILFdBQVcsQ0FBQztJQUN6QyxPQUFP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