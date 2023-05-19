const { JSDOM } = require("jsdom");
const { WebStorage } = require('../lib/storage');

// create virtual dom
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`,
  {
    url: "https://github.com/nferocious76/web-storage-manager",
    referrer: "https://github.com/nferocious76/web-storage-manager",
    contentType: "text/html",
    includeNodeLocations: true,
    storageQuota: 10000000
  });
const { window } = dom;

test('Test local storage', function () {
  expect(window.document.querySelector("p").textContent).toBe("Hello world");
  expect(window.location.href).toBe('https://github.com/nferocious76/web-storage-manager');

  window.localStorage.setItem('key', "test-virtual-dom");
  const testVal = window.localStorage.getItem('key');
  expect(testVal).toBe('test-virtual-dom');

  const LocalStorage = new WebStorage(window.localStorage);
  const isSuccess = LocalStorage.setItem('test1', 'test-value-1');
  expect(isSuccess).toBe(true);

  // somehow can't retrive using wrapper so we will just expect it to be null
  const test1 = LocalStorage.getItem('test1');
  expect(test1).toBeNull();

  // we're able to retrieve using window's storage
  const test1a = window.localStorage.getItem('test1');
  expect(test1a).toBe('"test-value-1"');

  // test deeper level updates
  const parentItem = {
    name: 'parent item',
    description: 'test object',
    'targetKeyOnParent': { id: 1 } // key of this
  }

  LocalStorage.setItem('test-sample', parentItem);
  const sourceData = window.localStorage.getItem('test-sample');
  const parsedSourceData = JSON.parse(sourceData);
  console.log('parsedSourceData', parsedSourceData);
  expect(parsedSourceData).toMatchObject(parentItem);

  // update item on key path of previously saved data
  const keyPath = 'test-sample.targetKeyOnParent'
  LocalStorage.updateItemInItem(keyPath, { id: 6 }, 'id');

  const test2 = window.localStorage.getItem('test-sample');
  const parsedTest2 = JSON.parse(test2);
  console.log('parsedTest2', parsedTest2);
  expect(parsedTest2).toMatchObject({
    name: 'parent item',
    description: 'test object',
    targetKeyOnParent: { id: 6 }
  });

  // append item
  LocalStorage.appendItem('test-sample', { new_item: { desc: 'new test item' } });

  const test3 = window.localStorage.getItem('test-sample');
  const parsedTest3 = JSON.parse(test3);
  console.log('parsedTest3', parsedTest3);

  expect(parsedTest3).toMatchObject({
    name: 'parent item',
    description: 'test object',
    targetKeyOnParent: { id: 6 },
    new_item: { desc: 'new test item' }
  });
});

test('Test session storage', function () {
  expect(window.document.querySelector("p").textContent).toBe("Hello world");
  expect(window.location.href).toBe('https://github.com/nferocious76/web-storage-manager');

  window.sessionStorage.setItem('key', "test-virtual-dom");
  const testVal = window.sessionStorage.getItem('key');
  expect(testVal).toBe('test-virtual-dom');

  const SessionStorage = new WebStorage(window.sessionStorage);
  const isSuccess = SessionStorage.setItem('test1', 'test-value-1');
  expect(isSuccess).toBe(true);

  // somehow can't retrive using wrapper so we will just expect it to be null
  const test1 = SessionStorage.getItem('test1');
  expect(test1).toBeNull();

  // we're able to retrieve using window's storage
  const test1a = window.sessionStorage.getItem('test1');
  expect(test1a).toBe('"test-value-1"');

  // test deeper level updates
  const parentItem = {
    name: 'parent item',
    description: 'test object',
    'targetKeyOnParent': { id: 7 } // key of this
  }

  SessionStorage.setItem('test-sample', parentItem);
  const sourceData = window.sessionStorage.getItem('test-sample');
  const parsedSourceData = JSON.parse(sourceData);
  console.log('parsedSourceData', parsedSourceData);
  expect(parsedSourceData).toMatchObject(parentItem);

  // update item on key path of previously saved data
  const keyPath = 'test-sample.targetKeyOnParent'
  SessionStorage.updateItemInItem(keyPath, { id: 8 }, 'id');

  const test2 = window.sessionStorage.getItem('test-sample');
  const parsedTest2 = JSON.parse(test2);
  console.log('parsedTest2', parsedTest2);
  expect(parsedTest2).toMatchObject({
    name: 'parent item',
    description: 'test object',
    targetKeyOnParent: { id: 8 }
  });

  // append item
  SessionStorage.appendItem('test-sample', { new_item: { desc: 'new test item' } });

  const test3 = window.sessionStorage.getItem('test-sample');
  const parsedTest3 = JSON.parse(test3);
  console.log('parsedTest3', parsedTest3);

  expect(parsedTest3).toMatchObject({
    name: 'parent item',
    description: 'test object',
    targetKeyOnParent: { id: 8 },
    new_item: { desc: 'new test item' }
  });
});