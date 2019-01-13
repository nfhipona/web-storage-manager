# Web Storage Manager

Web utility storage manager to handle save, update and data purge

[npm_url]: https://www.npmjs.com/package/web-storage-manager

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
const keyPaths = [ 'targetKeyOnParent', 'collection', 'targetObject', 'changethis']
const keyPaths2 = [ 'targetKeyOnParent', 'collection', 'targetObject', 'changethis2']

Storage.updateItemInItem('test-sample-parent-key', keyPaths, valueInObj, 'id')
Storage.updateItemInItem('test-sample-parent-key', keyPaths2, valueInObj)

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

    Storage.setItem('test-sample', parentItem);
    Storage.setItem('test-sample-for-compare', parentItem);

    const valueInObj = {
      id: 2,
      value: '010',
      description: 'test item 101'
    }

    const keyPaths = [ 'targetKeyOnParent', 'collection', 'targetObject', 'changethis']
    const keyPaths2 = [ 'targetKeyOnParent', 'collection', 'targetObject', 'changethis2']
    Storage.updateItemInItem('test-sample', keyPaths, valueInObj, 'id')
    Storage.updateItemInItem('test-sample', keyPaths2, valueInObj)
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
getItemInItem: ƒ (parentKey, childKeys, value, attrCompare)
getMultiple: ƒ (keys)
hasData: ƒ (key)
indexOfObject: ƒ (collection, object, attr)
isDataEncoded: ƒ (data)
purge: ƒ () // remove all saved data under active domain
removeItem: ƒ (key)
removeItemInItem: ƒ (parentKey, childKeys, value, attrCompare)
removeMultiple: ƒ (keys)
setEncodeItem: ƒ (key, value)
setEncodeMultiple: ƒ (items)
setItem: ƒ (key, value)
setMultiple: ƒ (items)
storage: ƒ ()
updateItemInItem: ƒ (parentKey, childKeys, value, attrCompare)

```


## Contribute
We would love for you to contribute to `Web Storage Manager`. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.

### About

This project was inpired by 'react-persist' that was discontinued.

## License

`Web Storage Manager` is available under the MIT license. See the [LICENSE](https://github.com/nferocious76/web-storage-manager/blob/master/LICENSE) file for more info.