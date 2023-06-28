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
  setMultipleItems(items) {
    try {
      var hasErrors = [];
      for (var item of items) {
        var result = this.setItem(item.key, item.value);
        if (!result) {
          hasErrors.push(item.key);
        }
      }
      if (hasErrors.length > 0) {
        return Error("Keypath with errors: ".concat(hasErrors.join(',')));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJXZWJTdG9yZSIsImNvbnN0cnVjdG9yIiwic3RvcmFnZSIsImRlbGltaXRlciIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsIl9jbGFzc1ByaXZhdGVNZXRob2RJbml0U3BlYyIsIl9pbmRleE9mT2JqZWN0IiwiX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdFNwZWMiLCJfc3RvcmFnZSIsIndyaXRhYmxlIiwidmFsdWUiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfY2xhc3NQcml2YXRlRmllbGRHZXQiLCJrZXkiLCJuIiwiZ2V0SXRlbSIsInN0cmluZ2lmaWVkIiwiY29udmVydGVkIiwiSlNPTiIsInBhcnNlIiwic2V0SXRlbSIsInN0cmluZ2lmeSIsImVycm9yIiwicmVtb3ZlSXRlbSIsImNsZWFyIiwic2V0TXVsdGlwbGVJdGVtcyIsIml0ZW1zIiwiaGFzRXJyb3JzIiwiaXRlbSIsInJlc3VsdCIsInB1c2giLCJFcnJvciIsImNvbmNhdCIsImpvaW4iLCJyZW1vdmVNdWx0aXBsZUl0ZW1zIiwia2V5cyIsInJlbW92ZUl0ZW1Jbkl0ZW0iLCJnZXRNdWx0aXBsZUl0ZW1zIiwiZ2V0SXRlbUluSXRlbSIsImFwcGVuZEl0ZW1Jbkl0ZW0iLCJrZXlQYXRocyIsInNwbGl0IiwicGFyZW50S2V5Iiwic2hpZnQiLCJjaGlsZEtleXMiLCJtYXAiLCJrIiwidHJpbSIsImRhdGEiLCJzb3VyY2VEYXRhIiwiaWR4IiwiY2hpbGRLZXkiLCJlbnRyaWVzIiwidGFyZ2V0SXRlbSIsIkFycmF5IiwiaXNBcnJheSIsIm1lcmdlZERhdGEiLCJfb2JqZWN0U3ByZWFkIiwidXBkYXRlSXRlbUluSXRlbSIsImF0dHJDb21wYXJlIiwibmV3VmFsdWUiLCJmb3VuZElkeCIsIl9jbGFzc1ByaXZhdGVNZXRob2RHZXQiLCJfaW5kZXhPZk9iamVjdDIiLCJjYWxsIiwibmFtZSIsInNwbGljZSIsImV4cG9ydHMiLCJ0YXJnZXRWYWx1ZSIsIk51bWJlciJdLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jbGFzcy9zdG9yYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQXR0cmlidXRlQ29tcGFyZSxcbiAgICBLZXlQYXRoLFxuICAgIFN0b3JhZ2UsXG4gICAgU3RvcmFnZUl0ZW0sXG4gICAgU3RvcmFnZVZhbHVlLFxuICAgIFdlYlN0b3JhZ2Vcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5leHBvcnQgY2xhc3MgV2ViU3RvcmUgaW1wbGVtZW50cyBXZWJTdG9yYWdlIHtcbiAgICAvKipcbiAgICAgKiBXZWIgc3RvcmUgdG8gYmUgdXNlZCBmb3IgdGhpcyBzZXNzaW9uLlxuICAgICAqL1xuICAgICNzdG9yYWdlOiBTdG9yYWdlO1xuICAgIGRlbGltaXRlcjogc3RyaW5nO1xuXG4gICAgLyoqXG4gICAgICogXG4gICAgICogQHBhcmFtIHN0b3JhZ2UgU3RvcmFnZSBpbnRlcmZhY2UgdG8gYmUgdXNlZCBhbmQgaW5pdGlhbGl6ZWQuXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZTogU3RvcmFnZSwgZGVsaW1pdGVyOiBzdHJpbmcgPSAnLicpIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZSA9IHN0b3JhZ2U7XG4gICAgICAgIHRoaXMuZGVsaW1pdGVyID0gZGVsaW1pdGVyO1xuICAgIH1cblxuICAgIGdldCBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuI3N0b3JhZ2UubGVuZ3RoO1xuICAgIH1cblxuICAgIGtleShuOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy4jc3RvcmFnZS5rZXkobik7XG4gICAgfVxuXG4gICAgZ2V0SXRlbShrZXk6IEtleVBhdGgpOiBTdG9yYWdlVmFsdWUge1xuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHRoaXMuI3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBjb25zdCBjb252ZXJ0ZWQgPSBKU09OLnBhcnNlKHN0cmluZ2lmaWVkKTtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRlZDtcbiAgICB9XG5cbiAgICBzZXRJdGVtKGtleTogS2V5UGF0aCwgdmFsdWU6IFN0b3JhZ2VWYWx1ZSk6IGJvb2xlYW4gfCBFcnJvciB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMuI3N0b3JhZ2Uuc2V0SXRlbShrZXksIHN0cmluZ2lmaWVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtKGtleTogS2V5UGF0aCk6IHZvaWQge1xuICAgICAgICB0aGlzLiNzdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBjbGVhcigpOiB2b2lkIHtcbiAgICAgICAgdGhpcy4jc3RvcmFnZS5jbGVhcigpO1xuICAgIH1cblxuICAgIHNldE11bHRpcGxlSXRlbXMoaXRlbXM6IFN0b3JhZ2VJdGVtW10pOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3QgaGFzRXJyb3JzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gdGhpcy5zZXRJdGVtKGl0ZW0ua2V5LCBpdGVtLnZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICBoYXNFcnJvcnMucHVzaChpdGVtLmtleSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGhhc0Vycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEVycm9yKGBLZXlwYXRoIHdpdGggZXJyb3JzOiAke2hhc0Vycm9ycy5qb2luKCcsJyl9YCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlTXVsdGlwbGVJdGVtcyhrZXlzOiBLZXlQYXRoW10pOiB2b2lkIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtSW5JdGVtKGtleSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRNdWx0aXBsZUl0ZW1zKGtleXM6IEtleVBhdGhbXSk6IFN0b3JhZ2VWYWx1ZVtdIHtcbiAgICAgICAgY29uc3QgaXRlbXM6IFN0b3JhZ2VWYWx1ZVtdID0gW107XG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIGtleXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLmdldEl0ZW1Jbkl0ZW0oa2V5KTtcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgaXRlbXMucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgYXBwZW5kSXRlbUluSXRlbShrZXk6IEtleVBhdGgsIHZhbHVlOiBhbnkpOiBib29sZWFuIHwgRXJyb3Ige1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgY29uc3Qga2V5UGF0aHM6IHN0cmluZ1tdID0ga2V5LnNwbGl0KHRoaXMuZGVsaW1pdGVyKTtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRLZXlzOiBzdHJpbmdbXSA9IGtleVBhdGhzLm1hcChrID0+IGsudHJpbSgpKTtcbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICAgICAgZm9yIChjb25zdCBbaWR4LCBjaGlsZEtleV0gb2YgY2hpbGRLZXlzLmVudHJpZXMoKSkge1xuICAgICAgICAgICAgICAgIGlmICghc291cmNlRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGlkeCA9PT0gY2hpbGRLZXlzLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldEl0ZW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJdGVtLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0YXJnZXRJdGVtID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBtZXJnZWREYXRhID0geyAuLi50YXJnZXRJdGVtLCAuLi52YWx1ZSB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YVtjaGlsZEtleV0gPSBtZXJnZWREYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU6IEF0dHJpYnV0ZUNvbXBhcmUgfCBudWxsLCBuZXdWYWx1ZTogU3RvcmFnZVZhbHVlKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGtleVBhdGhzOiBzdHJpbmdbXSA9IGtleS5zcGxpdCh0aGlzLmRlbGltaXRlcik7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSBrZXlQYXRocy5zaGlmdCgpIGFzIHN0cmluZztcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkS2V5czogc3RyaW5nW10gPSBrZXlQYXRocy5tYXAoayA9PiBrLnRyaW0oKSk7XG4gICAgICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSB0aGlzLmdldEl0ZW0ocGFyZW50S2V5KTtcblxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc291cmNlRGF0YTogYW55ID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2lkeCwgY2hpbGRLZXldIG9mIGNoaWxkS2V5cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCBvciBkYXRhIHNvdXJjZSBpcyBpbiBhbiBpbnZhbGlkIG9yIHVuc3VwcG9ydGVkIGZvcm1hdCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IGNoaWxkS2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEl0ZW06IGFueSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRJdGVtKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJZHggPSB0aGlzLiNpbmRleE9mT2JqZWN0KHRhcmdldEl0ZW0sIGF0dHJDb21wYXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldEl0ZW1bZm91bmRJZHhdID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldEl0ZW0gPT09ICdvYmplY3QnICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXRJdGVtW2F0dHJDb21wYXJlLm5hbWVdID0gbmV3VmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VEYXRhW2NoaWxkS2V5XSA9IHRhcmdldEl0ZW07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VEYXRhW2NoaWxkS2V5XSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2V0SXRlbShwYXJlbnRLZXksIGRhdGEpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVJdGVtSW5JdGVtKGtleTogS2V5UGF0aCwgYXR0ckNvbXBhcmU/OiBBdHRyaWJ1dGVDb21wYXJlKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGtleVBhdGhzOiBzdHJpbmdbXSA9IGtleS5zcGxpdCh0aGlzLmRlbGltaXRlcik7XG4gICAgICAgICAgICBjb25zdCBwYXJlbnRLZXkgPSBrZXlQYXRocy5zaGlmdCgpIGFzIHN0cmluZztcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkS2V5czogc3RyaW5nW10gPSBrZXlQYXRocy5tYXAoayA9PiBrLnRyaW0oKSk7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZEtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVJdGVtKHBhcmVudEtleSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGRhdGE6IGFueSA9IHRoaXMuZ2V0SXRlbShwYXJlbnRLZXkpO1xuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgc291cmNlRGF0YTogYW55ID0gZGF0YTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgW2lkeCwgY2hpbGRLZXldIG9mIGNoaWxkS2V5cy5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXNvdXJjZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignS2V5IG5vdCBmb3VuZCBvciBkYXRhIHNvdXJjZSBpcyBpbiBhbiBpbnZhbGlkIG9yIHVuc3VwcG9ydGVkIGZvcm1hdCcpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmIChpZHggPT09IGNoaWxkS2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRhcmdldEl0ZW06IGFueSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh0YXJnZXRJdGVtKSAmJiBhdHRyQ29tcGFyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJZHggPSB0aGlzLiNpbmRleE9mT2JqZWN0KHRhcmdldEl0ZW0sIGF0dHJDb21wYXJlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldLnNwbGljZShmb3VuZElkeCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldEl0ZW0gPT09ICdvYmplY3QnICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdGFyZ2V0SXRlbVthdHRyQ29tcGFyZS5uYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGFbY2hpbGRLZXldID0gdGFyZ2V0SXRlbTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZURhdGEgPSBzb3VyY2VEYXRhW2NoaWxkS2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNldEl0ZW0ocGFyZW50S2V5LCBkYXRhKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SXRlbUluSXRlbShrZXk6IEtleVBhdGgsIGF0dHJDb21wYXJlPzogQXR0cmlidXRlQ29tcGFyZSk6IFN0b3JhZ2VWYWx1ZSB7XG4gICAgICAgIGNvbnN0IGtleVBhdGhzOiBzdHJpbmdbXSA9IGtleS5zcGxpdCh0aGlzLmRlbGltaXRlcik7XG4gICAgICAgIGNvbnN0IHBhcmVudEtleSA9IGtleVBhdGhzLnNoaWZ0KCkgYXMgc3RyaW5nO1xuICAgICAgICBjb25zdCBjaGlsZEtleXM6IHN0cmluZ1tdID0ga2V5UGF0aHMubWFwKGsgPT4gay50cmltKCkpO1xuICAgICAgICBjb25zdCBkYXRhOiBhbnkgPSB0aGlzLmdldEl0ZW0ocGFyZW50S2V5KTtcblxuICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoJ0tleSBub3QgZm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzb3VyY2VEYXRhOiBhbnkgPSBkYXRhO1xuICAgICAgICBmb3IgKGNvbnN0IFtpZHgsIGNoaWxkS2V5XSBvZiBjaGlsZEtleXMuZW50cmllcygpKSB7XG4gICAgICAgICAgICBpZiAoIXNvdXJjZURhdGEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEVycm9yKCdLZXkgbm90IGZvdW5kIG9yIGRhdGEgc291cmNlIGlzIGluIGFuIGludmFsaWQgb3IgdW5zdXBwb3J0ZWQgZm9ybWF0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChpZHggPT09IGNoaWxkS2V5cy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0SXRlbTogYW55ID0gc291cmNlRGF0YVtjaGlsZEtleV07XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0SXRlbSkgJiYgYXR0ckNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZm91bmRJZHggPSB0aGlzLiNpbmRleE9mT2JqZWN0KHRhcmdldEl0ZW0sIGF0dHJDb21wYXJlKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldEl0ZW1bZm91bmRJZHhdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHRhcmdldEl0ZW0gPT09ICdvYmplY3QnICYmIGF0dHJDb21wYXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0YXJnZXRJdGVtW2F0dHJDb21wYXJlLm5hbWVdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0SXRlbTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc291cmNlRGF0YSA9IHNvdXJjZURhdGFbY2hpbGRLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNvdXJjZURhdGE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSGVscGVyc1xuICAgICAqL1xuXG4gICAgLyoqXG4gICAgICogRmluZCBhbmQgcmV0dXJucyBpbmRleCBvZiB0aGUgdGFyZ2V0IGl0ZW1cbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBzb3VyY2VEYXRhIC0gY29sbGVjdGlvbiBvZiBvYmplY3RzXG4gICAgICogQHBhcmFtIHtBdHRyaWJ1dGVDb21wYXJlfSBhdHRyQ29tcGFyZSAtIG9iamVjdCB0byBmaW5kIGluZGV4IGZyb20gdGhlIGNvbGxlY3Rpb25cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBpbmRleCBvZiBmb3VuZCBtYXRjaGluZyBpdGVtXG4gICAgICovXG4gICAgI2luZGV4T2ZPYmplY3Qoc291cmNlRGF0YTogUmVjb3JkPHN0cmluZywgYW55PltdLCBhdHRyQ29tcGFyZTogQXR0cmlidXRlQ29tcGFyZSk6IG51bWJlciB7XG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShzb3VyY2VEYXRhKSAmJiBhdHRyQ29tcGFyZSAmJiBhdHRyQ29tcGFyZS5uYW1lICYmIGF0dHJDb21wYXJlLnZhbHVlKSByZXR1cm4gLTE7XG4gICAgICAgIGZvciAoY29uc3QgW2lkeCwgZGF0YV0gb2Ygc291cmNlRGF0YS5lbnRyaWVzKCkpIHtcbiAgICAgICAgICAgIGxldCB0YXJnZXRWYWx1ZSA9IGRhdGFbYXR0ckNvbXBhcmUubmFtZV07XG4gICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJDb21wYXJlLnZhbHVlID09PSAnbnVtYmVyJykgeyAvLyBjaGVjayB0aGUgdHlwZSBvZiBzZWFyY2hlZCB2YWx1ZSBhbmQgdHJ5IHRvIGNvbXBhcmUgd2l0aCBpdCdzIGluaGVyZW50IHR5cGVcbiAgICAgICAgICAgICAgICB0YXJnZXRWYWx1ZSA9IE51bWJlcih0YXJnZXRWYWx1ZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0YXJnZXRWYWx1ZSA9PT0gYXR0ckNvbXBhcmUudmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWR4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICB9XG59Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQVNPLE1BQU1BLFFBQVEsQ0FBdUI7RUFPeEM7QUFDSjtBQUNBO0FBQ0E7RUFDSUMsV0FBV0EsQ0FBQ0MsT0FBZ0IsRUFBMkI7SUFBQSxJQUF6QkMsU0FBaUIsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLFFBQUFELFNBQUEsUUFBQUUsU0FBQSxHQUFBRixTQUFBLE1BQUcsR0FBRztJQWdPckQ7QUFDSjtBQUNBO0lBRUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0lBTElHLDJCQUFBLE9BQUFDLGNBQUE7SUE5T0E7QUFDSjtBQUNBO0lBRklDLDBCQUFBLE9BQUFDLFFBQUE7TUFBQUMsUUFBQTtNQUFBQyxLQUFBO0lBQUE7SUFXSUMscUJBQUEsS0FBSSxFQUFBSCxRQUFBLEVBQVlSLE9BQU87SUFDdkIsSUFBSSxDQUFDQyxTQUFTLEdBQUdBLFNBQVM7RUFDOUI7RUFF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