"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EncryptedWebStore = void 0;
require("core-js/modules/es.array.iterator.js");
require("core-js/modules/es.weak-map.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _storage2 = require("./storage");
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _storage = /*#__PURE__*/new WeakMap();
var _cryptor = /*#__PURE__*/new WeakMap();
class EncryptedWebStore extends _storage2.WebStore {
  /**
   * 
   * @param storage Storage interface to be used and initialized.
   */
  constructor(storage, cryptor) {
    var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '.';
    super(storage, delimiter);
    /**
     * Web store to be used for this session.
     */
    _classPrivateFieldInitSpec(this, _storage, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _cryptor, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _storage, storage);
    _classPrivateFieldSet(this, _cryptor, cryptor);
  }
  getItem(key) {
    var stringified = _classPrivateFieldGet(this, _storage).getItem(key);
    var decoded = _classPrivateFieldGet(this, _cryptor).decrypt(stringified);
    if (decoded) {
      var converted = JSON.parse(decoded);
      return converted;
    }
    return null;
  }
  setItem(key, value) {
    try {
      var stringified = JSON.stringify(value);
      var encodedString = _classPrivateFieldGet(this, _cryptor).encrypt(stringified);
      _classPrivateFieldGet(this, _storage).setItem(key, encodedString);
      return true;
    } catch (error) {
      throw error;
    }
  }
  getEncryptedRawItem(key) {
    return _classPrivateFieldGet(this, _storage).getItem(key);
  }
  setEncryptedRawItem(key, value) {
    try {
      _classPrivateFieldGet(this, _storage).setItem(key, value);
      return true;
    } catch (error) {
      throw error;
    }
  }
}
exports.EncryptedWebStore = EncryptedWebStore;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3RvcmFnZTIiLCJyZXF1aXJlIiwiX2NsYXNzUHJpdmF0ZUZpZWxkSW5pdFNwZWMiLCJvYmoiLCJwcml2YXRlTWFwIiwidmFsdWUiLCJfY2hlY2tQcml2YXRlUmVkZWNsYXJhdGlvbiIsInNldCIsInByaXZhdGVDb2xsZWN0aW9uIiwiaGFzIiwiVHlwZUVycm9yIiwiX2NsYXNzUHJpdmF0ZUZpZWxkR2V0IiwicmVjZWl2ZXIiLCJkZXNjcmlwdG9yIiwiX2NsYXNzRXh0cmFjdEZpZWxkRGVzY3JpcHRvciIsIl9jbGFzc0FwcGx5RGVzY3JpcHRvckdldCIsImdldCIsImNhbGwiLCJfY2xhc3NQcml2YXRlRmllbGRTZXQiLCJfY2xhc3NBcHBseURlc2NyaXB0b3JTZXQiLCJhY3Rpb24iLCJ3cml0YWJsZSIsIl9zdG9yYWdlIiwiV2Vha01hcCIsIl9jcnlwdG9yIiwiRW5jcnlwdGVkV2ViU3RvcmUiLCJXZWJTdG9yZSIsImNvbnN0cnVjdG9yIiwic3RvcmFnZSIsImNyeXB0b3IiLCJkZWxpbWl0ZXIiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJnZXRJdGVtIiwia2V5Iiwic3RyaW5naWZpZWQiLCJkZWNvZGVkIiwiZGVjcnlwdCIsImNvbnZlcnRlZCIsIkpTT04iLCJwYXJzZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJlbmNvZGVkU3RyaW5nIiwiZW5jcnlwdCIsImVycm9yIiwiZ2V0RW5jcnlwdGVkUmF3SXRlbSIsInNldEVuY3J5cHRlZFJhd0l0ZW0iLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsYXNzL2VuY3J5cHRlZC1zdG9yYWdlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgS2V5UGF0aCxcbiAgICBTdG9yYWdlVmFsdWUsXG4gICAgU3RvcmFnZVxufSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBXZWJTdG9yZSB9IGZyb20gXCIuL3N0b3JhZ2VcIjtcbmltcG9ydCB7IEVuY3J5cHRlZFdlYlN0b3JhZ2UgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBDcnlwdG9yIH0gZnJvbSBcIi4vY3J5cHRvclwiO1xuXG5leHBvcnQgY2xhc3MgRW5jcnlwdGVkV2ViU3RvcmUgZXh0ZW5kcyBXZWJTdG9yZSBpbXBsZW1lbnRzIEVuY3J5cHRlZFdlYlN0b3JhZ2Uge1xuICAgIC8qKlxuICAgICAqIFdlYiBzdG9yZSB0byBiZSB1c2VkIGZvciB0aGlzIHNlc3Npb24uXG4gICAgICovXG4gICAgI3N0b3JhZ2U6IFN0b3JhZ2U7XG4gICAgI2NyeXB0b3I6IENyeXB0b3I7XG5cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gc3RvcmFnZSBTdG9yYWdlIGludGVyZmFjZSB0byBiZSB1c2VkIGFuZCBpbml0aWFsaXplZC5cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdG9yYWdlOiBTdG9yYWdlLCBjcnlwdG9yOiBDcnlwdG9yLCBkZWxpbWl0ZXI6IHN0cmluZyA9ICcuJykge1xuICAgICAgICBzdXBlcihzdG9yYWdlLCBkZWxpbWl0ZXIpO1xuICAgICAgICB0aGlzLiNzdG9yYWdlID0gc3RvcmFnZTtcbiAgICAgICAgdGhpcy4jY3J5cHRvciA9IGNyeXB0b3I7XG4gICAgfVxuXG4gICAgZ2V0SXRlbShrZXk6IEtleVBhdGgpOiBTdG9yYWdlVmFsdWUge1xuICAgICAgICBjb25zdCBzdHJpbmdpZmllZCA9IHRoaXMuI3N0b3JhZ2UuZ2V0SXRlbShrZXkpO1xuICAgICAgICBjb25zdCBkZWNvZGVkID0gdGhpcy4jY3J5cHRvci5kZWNyeXB0KHN0cmluZ2lmaWVkKTtcbiAgICAgICAgaWYgKGRlY29kZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlcnRlZCA9IEpTT04ucGFyc2UoZGVjb2RlZCk7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydGVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHNldEl0ZW0oa2V5OiBLZXlQYXRoLCB2YWx1ZTogU3RvcmFnZVZhbHVlKTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHN0cmluZ2lmaWVkID0gSlNPTi5zdHJpbmdpZnkodmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgZW5jb2RlZFN0cmluZyA9IHRoaXMuI2NyeXB0b3IuZW5jcnlwdChzdHJpbmdpZmllZCk7XG4gICAgICAgICAgICB0aGlzLiNzdG9yYWdlLnNldEl0ZW0oa2V5LCBlbmNvZGVkU3RyaW5nKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRFbmNyeXB0ZWRSYXdJdGVtKGtleTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLiNzdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgICB9XG5cbiAgICBzZXRFbmNyeXB0ZWRSYXdJdGVtKGtleTogc3RyaW5nLCB2YWx1ZTogYW55KTogYm9vbGVhbiB8IEVycm9yIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuI3N0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUtBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtBQUFxQyxTQUFBQywyQkFBQUMsR0FBQSxFQUFBQyxVQUFBLEVBQUFDLEtBQUEsSUFBQUMsMEJBQUEsQ0FBQUgsR0FBQSxFQUFBQyxVQUFBLEdBQUFBLFVBQUEsQ0FBQUcsR0FBQSxDQUFBSixHQUFBLEVBQUFFLEtBQUE7QUFBQSxTQUFBQywyQkFBQUgsR0FBQSxFQUFBSyxpQkFBQSxRQUFBQSxpQkFBQSxDQUFBQyxHQUFBLENBQUFO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