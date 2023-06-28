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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
      this.removeItemInItem(key);
    }
  }
  getMultipleItems(keys) {
    var items = [];
    for (var key of keys) {
      var item = this.getItemInItem(key);
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
        if (!sourceData) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKeys.length - 1) {
          var targetItem = sourceData[childKey];
          if (Array.isArray(targetItem)) {
            targetItem.push(value);
          } else if (typeof targetItem === 'object' && typeof value === 'object') {
            var mergedData = _objectSpread(_objectSpread({}, targetItem), value);
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
  updateItemInItem(key, attrCompare, newValue) {
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
        if (!sourceData) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKeys.length - 1) {
          var targetItem = sourceData[childKey];
          if (Array.isArray(targetItem) && attrCompare) {
            var foundIdx = _classPrivateMethodGet(this, _indexOfObject, _indexOfObject2).call(this, targetItem, attrCompare);
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
  removeItemInItem(key, attrCompare) {
    try {
      var keyPaths = key.split(this.delimiter);
      var parentKey = keyPaths.shift();
      var childKeys = keyPaths.map(k => k.trim());
      if (childKeys.length === 0) {
        this.removeItem(parentKey);
        return true;
      }
      var data = this.getItem(parentKey);
      if (!data) {
        return new Error('Key not found');
      }
      var sourceData = data;
      for (var [idx, childKey] of childKeys.entries()) {
        if (!sourceData) {
          return new Error('Key not found or data source is in an invalid or unsupported format');
        }
        if (idx === childKeys.length - 1) {
          var targetItem = sourceData[childKey];
          if (Array.isArray(targetItem) && attrCompare) {
            var foundIdx = _classPrivateMethodGet(this, _indexOfObject, _indexOfObject2).call(this, targetItem, attrCompare);
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
  getItemInItem(key, attrCompare) {
    var keyPaths = key.split(this.delimiter);
    var parentKey = keyPaths.shift();
    var childKeys = keyPaths.map(k => k.trim());
    var data = this.getItem(parentKey);
    if (!data) {
      return new Error('Key not found');
    }
    var sourceData = data;
    for (var [idx, childKey] of childKeys.entries()) {
      if (!sourceData) {
        return new Error('Key not found or data source is in an invalid or unsupported format');
      }
      if (idx === childKeys.length - 1) {
        var targetItem = sourceData[childKey];
        if (Array.isArray(targetItem) && attrCompare) {
          var foundIdx = _classPrivateMethodGet(this, _indexOfObject, _indexOfObject2).call(this, targetItem, attrCompare);
          return targetItem[foundIdx];
        } else if (typeof targetItem === 'object') {
          if (attrCompare && attrCompare.name) {
            return targetItem[attrCompare.name];
          }
          return targetItem;
        }
      } else {
        sourceData = sourceData[childKey];
      }
    }
    return sourceData;
  }
}
exports.WebStore = WebStore;
function _indexOfObject2(sourceData, attrCompare) {
  if (!Array.isArray(sourceData) && attrCompare && attrCompare.name && attrCompare.value) return -1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXZWJTdG9yZSIsImNvbnN0cnVjdG9yIiwic3RvcmFnZSIsImRlbGltaXRlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIl9jbGFzc1ByaXZhdGVNZXRob2RJbml0U3BlYyIsIl9pbmRleE9mT2JqZWN0IiwiX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdFNwZWMiLCJfc3RvcmFnZSIsIndyaXRhYmxlIiwidmFsdWUiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCJrZXkiLCJuIiwiZ2V0SXRlbSIsInN0cmluZ2lmaWVkIiwiY29udmVydGVkIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImVycm9yIiwicmVtb3ZlSXRlbSIsImNsZWFyIiwiYXBwZW5kSXRlbSIsImRhdGEiLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwic2V0TXVsdGlwbGVJdGVtcyIsIml0ZW1zIiwiaXRlbSIsInJlbW92ZU11bHRpcGxlSXRlbXMiLCJrZXlzIiwicmVtb3ZlSXRlbUluSXRlbSIsImdldE11bHRpcGxlSXRlbXMiLCJnZXRJdGVtSW5JdGVtIiwiYXBwZW5kSXRlbUluSXRlbSIsImtleVBhdGhzIiwic3BsaXQiLCJwYXJlbnRLZXkiLCJzaGlmdCIsImNoaWxkS2V5cyIsIm1hcCIsImsiLCJ0cmltIiwiRXJyb3IiLCJzb3VyY2VEYXRhIiwiaWR4IiwiY2hpbGRLZXkiLCJlbnRyaWVzIiwidGFyZ2V0SXRlbSIsIm1lcmdlZERhdGEiLCJfb2JqZWN0U3ByZWFkIiwidXBkYXRlSXRlbUluSXRlbSIsImF0dHJDb21wYXJlIiwibmV3VmFsdWUiLCJmb3VuZElkeCIsIl9jbGFzc1ByaXZhdGVNZXRob2RHZXQiLCJfaW5kZXhPZk9iamVjdDIiLCJjYWxsIiwibmFtZSIsInNwbGljZSIsImV4cG9ydHMiLCJ0YXJnZXRWYWx1ZSIsIk51bWJlciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzcy9zdG9yYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXR0cmlidXRlQ29tcGFyZSxcbiAgICBLZXlQYXRoLFxuICAgIFN0b3JhZ2UsXG4gICAgU3RvcmFnZUl0ZW0sXG4gICAgU3RvcmFnZVZhbHVlLFxuICAgIFdlYlN0b3JhZ2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgV2ViU3RvcmUgaW1wbGVtZW50cyBXZWJTdG9yYWdlIHtcbiAgICAvKipcbiAgICAgKiBXZWIgc3RvcmUgdG8gYmUgdXNlZCBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqL1xuICAgICNzdG9yYWdlOiBTdG9yYWdlO1xuICAgIGRlbGltaXRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHN0b3JhZ2UgU3RvcmFnZSBpbnRlcmZhY2UgdG8gYmUgdXNlZCBhbmQgaW5pdGlhbGl6ZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSwgZGVsaW1pdGVyOiBzdHJpbmcgPSAnLicpIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N0b3JhZ2UubGVuZ3RoO1xuICAgIH1cblxuICAgIGtleShuOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy4jc3RvcmFnZS5rZXkobik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbShrZXk6IEtleVBhdGgpOiBTdG9yYWdlVmFsdWUge1xuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHRoaXMuI3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWQgPSBKU09OLnBhcnNlKHN0cmluZ2lmaWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZDtcbiAgICB9XG5cbiAgICBzZXRJdGVtKGtleTogS2V5UGF0aCwgdmFsdWU6IFN0b3JhZ2VWYWx1ZSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuI3N0b3JhZ2Uuc2V0SXRlbShrZXksIHN0cmluZ2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGtleTogS2V5UGF0aCk6IHZvaWQge1xuICAgICAgICB0aGlzLiNzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZS5jbGVhcigpO1xuICAgIH1cblxuXG4gICAgYXBwZW5kSXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShrZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNdWx0aXBsZUl0ZW1zKGl0ZW1zOiBTdG9yYWdlSXRlbVtdKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy4jc3RvcmFnZS5zZXRJdGVtKGl0ZW0ua2V5LCBzdHJpbmdpZmllZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlTXVsdGlwbGVJdGVtcyhrZXlzOiBLZXlQYXRoW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtSW5JdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNdWx0aXBsZUl0ZW1zKGtleXM6IEtleVBhdGhbXSk6IFN0b3JhZ2VWYWx1ZVtdIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFN0b3JhZ2VWYWx1ZVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1Jbkl0ZW0oa2V5KTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgYXBwZW5kSXRlbUluSXRlbShrZXk6IEtleVBhdGgsIHZhbHVlOiBhbnkpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJdGVtLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRJdGVtID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWREYXRhID0geyAuLi50YXJnZXRJdGVtLCAuLi52YWx1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSBtZXJnZWREYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU6IEF0dHJpYnV0ZUNvbXBhcmUsIG5ld1ZhbHVlOiBTdG9yYWdlVmFsdWUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SXRlbVtmb3VuZElkeF0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEl0ZW1bYXR0ckNvbXBhcmUubmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0gdGFyZ2V0SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VEYXRhID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRJdGVtKHBhcmVudEtleSwgZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUl0ZW1Jbkl0ZW0oa2V5OiBLZXlQYXRoLCBhdHRyQ29tcGFyZT86IEF0dHJpYnV0ZUNvbXBhcmUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUl0ZW0ocGFyZW50S2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5nZXRJdGVtKHBhcmVudEtleSk7XG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0uc3BsaWNlKGZvdW5kSWR4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJdGVtW2F0dHJDb21wYXJlLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSB0YXJnZXRJdGVtO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU/OiBBdHRyaWJ1dGVDb21wYXJlKTogU3RvcmFnZVZhbHVlIHtcbiAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5ID0ga2V5UGF0aHMuc2hpZnQoKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGNoaWxkS2V5czogc3RyaW5nW10gPSBrZXlQYXRocy5tYXAoayA9PiBrLnRyaW0oKSk7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNvdXJjZURhdGE6IGFueSA9IGRhdGE7XG4gICAgICAgIGZvciAoY29uc3QgW2lkeCwgY2hpbGRLZXldIG9mIGNoaWxkS2V5cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0tleSBub3QgZm91bmQgb3IgZGF0YSBzb3VyY2UgaXMgaW4gYW4gaW52YWxpZCBvciB1bnN1cHBvcnRlZCBmb3JtYXQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRJdGVtOiBhbnkgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRJdGVtKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0SXRlbVtmb3VuZElkeF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0dHJDb21wYXJlICYmIGF0dHJDb21wYXJlLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRJdGVtW2F0dHJDb21wYXJlLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRJdGVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZURhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCBhbmQgcmV0dXJucyBpbmRleCBvZiB0aGUgdGFyZ2V0IGl0ZW1cbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBzb3VyY2VEYXRhIC0gY29sbGVjdGlvbiBvZiBvYmplY3RzXG4gICAgICogQHBhcmFtIHtBdHRyaWJ1dGVDb21wYXJlfSBhdHRyQ29tcGFyZSAtIG9iamVjdCB0byBmaW5kIGluZGV4IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiBmb3VuZCBtYXRjaGluZyBpdGVtXG4gICAgICovXG4gICAgI2luZGV4T2ZPYmplY3Qoc291cmNlRGF0YTogUmVjb3JkPHN0cmluZywgYW55PltdLCBhdHRyQ29tcGFyZTogQXR0cmlidXRlQ29tcGFyZSk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhKSAmJiBhdHRyQ29tcGFyZSAmJiBhdHRyQ29tcGFyZS5uYW1lICYmIGF0dHJDb21wYXJlLnZhbHVlKSByZXR1cm4gLTE7XG4gICAgICAgIGZvciAoY29uc3QgW2lkeCwgZGF0YV0gb2Ygc291cmNlRGF0YS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRWYWx1ZSA9IGRhdGFbYXR0ckNvbXBhcmUubmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJDb21wYXJlLnZhbHVlID09PSAnbnVtYmVyJykgeyAvLyBjaGVjayB0aGUgdHlwZSBvZiBzZWFyY2hlZCB2YWx1ZSBhbmQgdHJ5IHRvIGNvbXBhcmUgd2l0aCBpdCdzIGluaGVyZW50IHR5cGVcbiAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IE51bWJlcih0YXJnZXRWYWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXJnZXRWYWx1ZSA9PT0gYXR0ckNvbXBhcmUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG59Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNPLE1BQU1BLFFBQVEsQ0FBdUI7RUFPeEM7QUFDSjtBQUNBO0FBQ0E7RUFDSUMsV0FBV0EsQ0FBQ0MsT0FBZ0IsRUFBMkI7SUFBQSxJQUF6QkMsU0FBaUIsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFB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