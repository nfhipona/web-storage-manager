[![NPM](https://nodei.co/npm/web-storage-manager.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-storage-manager/)

# Web Storage Manager
[web-storage-manager](https://www.npmjs.com/package/web-storage-manager) is a web utility storage manager to handle save, update and data purge.

## Installation

```bash

npm i web-storage-manager --save

```

## Imports

```js

import { LocalStorage, SessionStorage, EncodedLocalStorage, EncodedSessionStorage } from 'web-storage-manager';

```

or using helper

```js

import { createLocalStorage, createSessionStorage } from 'web-storage-manager';

// Options conforms to:
/*
interface Options {
    delimiter?: string,
    isEncoded: boolean
}
*/

// createLocalStorage(window, options)
const LocalStorage = createLocalStorage(window, { isEncoded: false });
const SessionStorage = createSessionStorage(window, { isEncoded: false });
const EncodedLocalStorage = createLocalStorage(window, { isEncoded: true });
const EncodedSessionStorage = createSessionStorage(window, { isEncoded: true });

```

or using the base class

```js

import { WebStorage, EncodedWebStore } from 'web-storage-manager';

// both class has a constructor:
// constructor(storage: Storage, delimiter: string = '.')

const LocalStorage = new WebStorage(window.localStorage, delimiter);
const SessionStorage = new WebStorage(window.sessionStorage, delimiter);

const EncodedLocalStorage = new EncodedWebStore(window.localStorage, delimiter);
const EncodedSessionStorage = new EncodedWebStore(window.sessionStorage, delimiter);

```

## Usage and Examples

Please refer to test files `local.test.js` and `session.test.js` for a complete sample and usage.

```js

WebStorage.setItem('sampleKey', 'sampleValue');

const testObject = {
    nestedKey: {
        nestedKeyA: 'nestedKeyA-target-value',
        nestedKeyB: {
            nestedKeyC: { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
            nestedKeyD: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
        }
    }
};

const isSuccess = WebStorage.setItem('testKey', testObject);
// expected result: true

const item2 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyA');
// expected result: nestedKeyA-target-value

```

## Available Functions

```js

key: ƒ key(n)
length: ƒ length()
setItem: ƒ setItem(key, value)
getItem: ƒ getItem(key)
clear: ƒ clear()
getItemInItem: ƒ getItemInItem(key, attrCompare)
getMultipleItems: ƒ getMultipleItems(keys)
appendItemInItem: ƒ appendItemInItem(key, value)
setMultipleItems: ƒ setMultipleItems(items)
updateItemInItem: ƒ updateItemInItem(key, attrCompare, newValue)
removeItem: ƒ removeItem(key)
removeItemInItem: ƒ removeItemInItem(key, attrCompare)
removeMultipleItems: ƒ removeMultipleItems(keys)

```

## Contribute
We would love for you to contribute to `Web Storage Manager`. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.

### About

This project was inpired by 'react-persist' that I felt lacking of the functionalities that I need that I decided to create my own on top of Storage API.
This project has grown and had a major rebump in its version 3.

## License

`Web Storage Manager` is available under the MIT license. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.
