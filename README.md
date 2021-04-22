[![NPM version](https://badge.fury.io/js/web-storage-manager.svg)](http://badge.fury.io/js/web-storage-manager)

[![NPM](https://nodei.co/npm/web-storage-manager.png?downloads=true&stars=true)](https://nodei.co/npm/web-storage-manager/)

[![NPM](https://nodei.co/npm-dl/web-storage-manager.png?months=6)](https://nodei.co/npm/web-storage-manager/)

# Web Storage Manager
[web-storage-manager](https://www.npmjs.com/package/web-storage-manager) is a web utility storage manager to handle save, update and data purge.

## Demo

[Demo Page](https://github.com/nferocious76/web-storage-manager-example)

## Installation

```bash
npm install web-storage-manager --save
```

## Usage

```js

import Storage from 'web-storage-manager';

// update item on key path of previously saved data
const keyPath = 'targetKeyOnParent.collection.targetObject.changethis'
const keyPath2 = 'targetKeyOnParent.collection.targetObject.changethis2'

Storage.updateItemInItem(keyPath, valueInObj, 'id')
Storage.updateItemInItem(keyPath2, valueInObj)

// append item
Storage.appendItem('test-sample', { new_item : { desc: 'new test item' } })

```

### Examples

```js

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Storage from 'web-storage-manager';

class App extends Component {

  componentWillMount() {

    // updateItemInItem example
    const testItems = [
      {
        id: 1,
        value: '777',
        description: 'test item 1'
      }, {
        id: 2,
        value: '888',
        description: 'test item 2'
      }, {
        id: 3,
        value: '999',
        description: 'test item 3'
      }
    ]

    const testOjb = {
      name: 'Object',
      value: 'target of change',
      description: 'test item for object type'
    }

    const tObj = {
      'changethis': testItems, // key of this
      'changethis2': testOjb // key of this
    }

    let collection = {
      name: 'The data where our target object was saved',
      'targetObject': tObj // key of this
    }

    let collectionInfo = {
      description: 'just another layer for testing',
      'collection': collection // key of this
    }

    let parentItem = {
      name: 'parent item',
      description: 'test object',
      'targetKeyOnParent': collectionInfo // key of this
    }

    Storage.setItem('test-sample', parentItem, true);
    Storage.setItem('test-sample-for-compare', parentItem);

    const valueInObj = {
      id: 2,
      value: '01220',
      description: 'test item 101'
    }

    const keyPath = 'targetKeyOnParent.collection.targetObject.changethis'
    Storage.updateItemInItem(keyPath, valueInObj, 'id')

    const keyPath2 = 'targetKeyOnParent.collection.targetObject.changethis2'
    Storage.updateItemInItem(keyPath2, valueInObj)

    const keyPath3 = 'targetKeyOnParent.collection.targetObject2'
    Storage.updateItemInItem(keyPath3, testItems)

    const valueInObj2 = {
      id: 1,
      value: '015',
      description: 'test item 151'
    }
    const keyPath4 = 'targetKeyOnParent.collection.targetObject2'
    Storage.updateItemInItem(keyPath4, valueInObj2)

    // append
    Storage.appendItem('test-sample', { new_item : { desc: 'new test item' } })

    Storage.removeItemInItem(keyPath, valueInObj, 'id')

    Storage.setItem('copy', Storage.getItem('test-sample'))

    // save multiple
    Storage.setMultiple([
      {
        key: 'multiple-save-1',
        value: 'multiple-save-data-1'
      },
      {
        key: 'multiple-save-2',
        value: ['multiple-save-data-2', 'multiple-save-data-2']
      },{
        key: 'multiple-save-3',
        value: { desc: 'multiple-save-data-3' }
      }
    ])
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

```

## Available Functions

```js

appendItem: ƒ (key, value)
combineObject: ƒ (object, toObject)
decode: ƒ (encObj)
encode: ƒ (obj)
getItem: ƒ (key)
getItemInItem: ƒ (keyPath, value, attrCompare)
getMultiple: ƒ (keys)
hasData: ƒ (key)
indexOfObject: ƒ (collection, object, attr)
isDataEncoded: ƒ (data)
purge: ƒ ()
removeItem: ƒ (key)
removeItemInItem: ƒ (keyPath, value, attrCompare)
removeMultiple: ƒ (keys)
setItem: ƒ (key, value, encoded)
setMultiple: ƒ (items, encoded)
storage: ƒ ()
updateItemInItem: ƒ (keyPath, value, attrCompare)

```


## Contribute
We would love for you to contribute to `Web Storage Manager`. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.

### About

This project was inpired by 'react-persist' that was discontinued.

## License

`Web Storage Manager` is available under the MIT license. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.
