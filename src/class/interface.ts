// https://developer.mozilla.org/en-US/docs/Web/API/Storage

import { Buffer } from 'node:buffer';

export type KeyPath = string;
export type StorageValue = any;
export type StorageItem = { key: KeyPath; value: StorageValue };

/**
 * Attribute compare will work for a collection of items where values match or will replace a value of the matched key for data objects.
 */
export type AttributeCompare = { name: string; value: string | number };

export type Storage = {
  /**
   * keypath delimeter. defaults to '.'.
   */
  delimiter: string;

  /**
   * Returns an integer representing the number of data items stored in the Storage object.
   */
  get length(): number;

  /**
   * Returns an integer representing the number of data items stored in the Storage object.
   * @param n When passed a number n, this method will return the name of the nth key in the storage.
   */
  key(n: number): number;

  /**
   * When passed a key name, will return that key's value.
   * @param {KeyPath} key key name.
   */
  getItem(key: KeyPath): StorageValue;

  /**
   * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
   * @param {KeyPath} key A string containing the name of the key you want to create/update.
   * @param {StorageValue} value A string containing the value you want to give the key you are creating/updating.
   */
  setItem(key: KeyPath, value: StorageValue): boolean | Error;

  /**
   * When passed a key name, will remove that key from the storage.
   * @param {KeyPath} key A string containing the name of the key you want to remove.
   */
  removeItem(key: KeyPath): void;

  /**
   * When invoked, will empty all keys out of the storage.
   */
  clear(): void;
};

export type WebStorage = Storage & {
  /**
   * Add multiple entries of key value pairs to the storage.
   * @param {StorageItem[]} items Items to add individually in the storage.
   */
  setMultipleItems(items: StorageItem[]): boolean | Error;

  /**
   * Remove multiple entries found in the specified keypaths.
   * Will only work on top level keypaths and will not utilize an `AttributeCompare`.
   * Use `removeItemInItem` to utilize an `AttributeCompare`.
   * @param {KeyPath[]} keys
   */
  removeMultipleItems(keys: KeyPath[]): void;

  /**
   * Returns multiple entries found in the specified keypaths.
   * Will only work on top level keypaths and will not utilize an `AttributeCompare`.
   * Use `getItemInItem` to utilize an `AttributeCompare`.
   * @param {KeyPath[]} keys
   */
  getMultipleItems(keys: KeyPath[]): StorageValue[];

  /**
   * Append item to an existing item on the storage. Works for object and array type data.
   * @param {KeyPath} key keypath of the data you want to append to.
   * @param {StorageValue} value data value you want to append to.
   */
  appendItemInItem(key: KeyPath, value: StorageValue): boolean | Error;

  /**
   * Updates an item in the specified keypath.
   * @param {KeyPath} key keypath of the data.
   * @param {AttributeCompare} attrCompare data key attribute to be updated.
   */
  updateItemInItem(
    key: KeyPath,
    attrCompare: AttributeCompare | null,
    newValue: StorageValue,
  ): boolean | Error;

  /**
   * Removes an item in the specified keypath.
   * @param {KeyPath} key keypath of the data.
   * @param {AttributeCompare} attrCompare data key attribute to be updated.
   */
  removeItemInItem(
    key: KeyPath,
    attrCompare?: AttributeCompare,
  ): boolean | Error;

  /**
   * Returns data found in the specified keypath.
   * @param {KeyPath} key keypath of the data.
   * @param {AttributeCompare} attrCompare data key attribute to be updated.
   */
  getItemInItem(key: KeyPath, attrCompare?: AttributeCompare): StorageValue;
};

export type EncryptedWebStorage = Storage & {
  /**
   * When passed a key name, will return that key's value.
   * @param {KeyPath} key key name.
   */
  getEncryptedRawItem(key: KeyPath): StorageValue;

  /**
   * When passed a key name and value, will add that key to the storage, or update that key's value if it already exists.
   * @param {KeyPath} key A string containing the name of the key you want to create/update.
   * @param {StorageValue} value A string containing the value you want to give the key you are creating/updating.
   */
  setEncryptedRawItem(key: KeyPath, value: StorageValue): boolean | Error;
};

/**
 * Cryptor interface
 */
export type CryptorOption = {
  salt: string | Buffer;
  keyLength: number;
  algorithm: string;
  password: string | Buffer;
  byteLength: number; // Buffer
};

export type KeyOption = string | null;
export type ReturnOption = string | null;
export type VectorIV = string | null;

export type CryptorModel = {
  /**
   * Returns the cryptor's configs
   */
  get settings(): CryptorOption;

  /**
   * Returns the cryptor's generated encryption key
   */
  get key(): KeyOption;

  /**
   * Returns the cryptor's initialization vector.
   * NOTE: This is important for decryption. Make sure you store it somewhere for reuse.
   */
  get ivHex(): KeyOption;

  /**
   * Encrypt the data and save to storage.
   */
  encrypt(subject: string): ReturnOption;

  /**
   * Returns the decrypted data from storage.
   */
  decrypt(encrypted: string): ReturnOption;
};
