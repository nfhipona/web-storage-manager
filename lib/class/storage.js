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
        } else if (typeof targetItem === 'object' && attrCompare) {
          return targetItem[attrCompare.name];
        }
        return targetItem;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXZWJTdG9yZSIsImNvbnN0cnVjdG9yIiwic3RvcmFnZSIsImRlbGltaXRlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIl9jbGFzc1ByaXZhdGVNZXRob2RJbml0U3BlYyIsIl9pbmRleE9mT2JqZWN0IiwiX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdFNwZWMiLCJfc3RvcmFnZSIsIndyaXRhYmxlIiwidmFsdWUiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCJrZXkiLCJuIiwiZ2V0SXRlbSIsInN0cmluZ2lmaWVkIiwiY29udmVydGVkIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImVycm9yIiwicmVtb3ZlSXRlbSIsImNsZWFyIiwiYXBwZW5kSXRlbSIsImRhdGEiLCJBcnJheSIsImlzQXJyYXkiLCJwdXNoIiwic2V0TXVsdGlwbGVJdGVtcyIsIml0ZW1zIiwiaXRlbSIsInJlbW92ZU11bHRpcGxlSXRlbXMiLCJrZXlzIiwicmVtb3ZlSXRlbUluSXRlbSIsImdldE11bHRpcGxlSXRlbXMiLCJnZXRJdGVtSW5JdGVtIiwiYXBwZW5kSXRlbUluSXRlbSIsImtleVBhdGhzIiwic3BsaXQiLCJwYXJlbnRLZXkiLCJzaGlmdCIsImNoaWxkS2V5cyIsIm1hcCIsImsiLCJ0cmltIiwiRXJyb3IiLCJzb3VyY2VEYXRhIiwiaWR4IiwiY2hpbGRLZXkiLCJlbnRyaWVzIiwidGFyZ2V0SXRlbSIsIm1lcmdlZERhdGEiLCJfb2JqZWN0U3ByZWFkIiwidXBkYXRlSXRlbUluSXRlbSIsImF0dHJDb21wYXJlIiwibmV3VmFsdWUiLCJmb3VuZElkeCIsIl9jbGFzc1ByaXZhdGVNZXRob2RHZXQiLCJfaW5kZXhPZk9iamVjdDIiLCJjYWxsIiwibmFtZSIsInNwbGljZSIsImV4cG9ydHMiLCJ0YXJnZXRWYWx1ZSIsIk51bWJlciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzcy9zdG9yYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXR0cmlidXRlQ29tcGFyZSxcbiAgICBLZXlQYXRoLFxuICAgIFN0b3JhZ2UsXG4gICAgU3RvcmFnZUl0ZW0sXG4gICAgU3RvcmFnZVZhbHVlLFxuICAgIFdlYlN0b3JhZ2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgV2ViU3RvcmUgaW1wbGVtZW50cyBXZWJTdG9yYWdlIHtcbiAgICAvKipcbiAgICAgKiBXZWIgc3RvcmUgdG8gYmUgdXNlZCBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqL1xuICAgICNzdG9yYWdlOiBTdG9yYWdlO1xuICAgIGRlbGltaXRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHN0b3JhZ2UgU3RvcmFnZSBpbnRlcmZhY2UgdG8gYmUgdXNlZCBhbmQgaW5pdGlhbGl6ZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSwgZGVsaW1pdGVyOiBzdHJpbmcgPSAnLicpIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N0b3JhZ2UubGVuZ3RoO1xuICAgIH1cblxuICAgIGtleShuOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy4jc3RvcmFnZS5rZXkobik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbShrZXk6IEtleVBhdGgpOiBTdG9yYWdlVmFsdWUge1xuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHRoaXMuI3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWQgPSBKU09OLnBhcnNlKHN0cmluZ2lmaWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZDtcbiAgICB9XG5cbiAgICBzZXRJdGVtKGtleTogS2V5UGF0aCwgdmFsdWU6IFN0b3JhZ2VWYWx1ZSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuI3N0b3JhZ2Uuc2V0SXRlbShrZXksIHN0cmluZ2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGtleTogS2V5UGF0aCk6IHZvaWQge1xuICAgICAgICB0aGlzLiNzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZS5jbGVhcigpO1xuICAgIH1cblxuXG4gICAgYXBwZW5kSXRlbShrZXk6IHN0cmluZywgdmFsdWU6IGFueSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShrZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRNdWx0aXBsZUl0ZW1zKGl0ZW1zOiBTdG9yYWdlSXRlbVtdKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBpdGVtcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkoaXRlbS52YWx1ZSk7XG4gICAgICAgICAgICAgICAgdGhpcy4jc3RvcmFnZS5zZXRJdGVtKGl0ZW0ua2V5LCBzdHJpbmdpZmllZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlTXVsdGlwbGVJdGVtcyhrZXlzOiBLZXlQYXRoW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtSW5JdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNdWx0aXBsZUl0ZW1zKGtleXM6IEtleVBhdGhbXSk6IFN0b3JhZ2VWYWx1ZVtdIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFN0b3JhZ2VWYWx1ZVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1Jbkl0ZW0oa2V5KTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgYXBwZW5kSXRlbUluSXRlbShrZXk6IEtleVBhdGgsIHZhbHVlOiBhbnkpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJdGVtLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRJdGVtID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWREYXRhID0geyAuLi50YXJnZXRJdGVtLCAuLi52YWx1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSBtZXJnZWREYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU6IEF0dHJpYnV0ZUNvbXBhcmUsIG5ld1ZhbHVlOiBTdG9yYWdlVmFsdWUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SXRlbVtmb3VuZElkeF0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEl0ZW1bYXR0ckNvbXBhcmUubmFtZV0gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0gdGFyZ2V0SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzb3VyY2VEYXRhID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zZXRJdGVtKHBhcmVudEtleSwgZGF0YSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUl0ZW1Jbkl0ZW0oa2V5OiBLZXlQYXRoLCBhdHRyQ29tcGFyZT86IEF0dHJpYnV0ZUNvbXBhcmUpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkS2V5cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbW92ZUl0ZW0ocGFyZW50S2V5KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgZGF0YTogYW55ID0gdGhpcy5nZXRJdGVtKHBhcmVudEtleSk7XG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0uc3BsaWNlKGZvdW5kSWR4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB0YXJnZXRJdGVtW2F0dHJDb21wYXJlLm5hbWVdO1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSB0YXJnZXRJdGVtO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU/OiBBdHRyaWJ1dGVDb21wYXJlKTogU3RvcmFnZVZhbHVlIHtcbiAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgY29uc3QgcGFyZW50S2V5ID0ga2V5UGF0aHMuc2hpZnQoKSBhcyBzdHJpbmc7XG4gICAgICAgIGNvbnN0IGNoaWxkS2V5czogc3RyaW5nW10gPSBrZXlQYXRocy5tYXAoayA9PiBrLnRyaW0oKSk7XG4gICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNvdXJjZURhdGE6IGFueSA9IGRhdGE7XG4gICAgICAgIGZvciAoY29uc3QgW2lkeCwgY2hpbGRLZXldIG9mIGNoaWxkS2V5cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0tleSBub3QgZm91bmQgb3IgZGF0YSBzb3VyY2UgaXMgaW4gYW4gaW52YWxpZCBvciB1bnN1cHBvcnRlZCBmb3JtYXQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB0YXJnZXRJdGVtOiBhbnkgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRJdGVtKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmb3VuZElkeCA9IHRoaXMuI2luZGV4T2ZPYmplY3QodGFyZ2V0SXRlbSwgYXR0ckNvbXBhcmUpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0SXRlbVtmb3VuZElkeF07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdGFyZ2V0SXRlbSA9PT0gJ29iamVjdCcgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldEl0ZW1bYXR0ckNvbXBhcmUubmFtZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRJdGVtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzb3VyY2VEYXRhID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc291cmNlRGF0YTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBIZWxwZXJzXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIGFuZCByZXR1cm5zIGluZGV4IG9mIHRoZSB0YXJnZXQgaXRlbVxuICAgICAqIEBwYXJhbSB7T2JqZWN0W119IHNvdXJjZURhdGEgLSBjb2xsZWN0aW9uIG9mIG9iamVjdHNcbiAgICAgKiBAcGFyYW0ge0F0dHJpYnV0ZUNvbXBhcmV9IGF0dHJDb21wYXJlIC0gb2JqZWN0IHRvIGZpbmQgaW5kZXggZnJvbSB0aGUgY29sbGVjdGlvblxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IGluZGV4IG9mIGZvdW5kIG1hdGNoaW5nIGl0ZW1cbiAgICAgKi9cbiAgICAjaW5kZXhPZk9iamVjdChzb3VyY2VEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+W10sIGF0dHJDb21wYXJlOiBBdHRyaWJ1dGVDb21wYXJlKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHNvdXJjZURhdGEpICYmIGF0dHJDb21wYXJlICYmIGF0dHJDb21wYXJlLm5hbWUgJiYgYXR0ckNvbXBhcmUudmFsdWUpIHJldHVybiAtMTtcbiAgICAgICAgZm9yIChjb25zdCBbaWR4LCBkYXRhXSBvZiBzb3VyY2VEYXRhLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgbGV0IHRhcmdldFZhbHVlID0gZGF0YVthdHRyQ29tcGFyZS5uYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0ckNvbXBhcmUudmFsdWUgPT09ICdudW1iZXInKSB7IC8vIGNoZWNrIHRoZSB0eXBlIG9mIHNlYXJjaGVkIHZhbHVlIGFuZCB0cnkgdG8gY29tcGFyZSB3aXRoIGl0J3MgaW5oZXJlbnQgdHlwZVxuICAgICAgICAgICAgICAgIHRhcmdldFZhbHVlID0gTnVtYmVyKHRhcmdldFZhbHVlKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRhcmdldFZhbHVlID09PSBhdHRyQ29tcGFyZS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZHg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbn0iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBU08sTUFBTUEsUUFBUSxDQUF1QjtFQU94QztBQUNKO0FBQ0E7QUFDQTtFQUNJQyxXQUFXQSxDQUFDQyxPQUFnQixFQUEyQjtJQUFBLElBQXpCQyxTQUFpQixHQUFBQyxTQUFBLENBQUFDLE1BQUEsUUFBQUQsU0FBQSxRQUFBRSxTQUFBLEdBQUFGLFNBQUEsTUFBRyxHQUFHO0lBeU9yRDtBQUNKO0FBQ0E7SUFFSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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