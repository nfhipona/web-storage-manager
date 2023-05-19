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
});