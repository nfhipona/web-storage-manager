const { JSDOM } = require('jsdom');
const { WebStore } = require('../lib/class/storage');

// create virtual dom
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`,
    {
        url: 'https://github.com/nferocious76/web-storage-manager',
        referrer: 'https://www.npmjs.com/package/web-storage-manager',
        contentType: 'text/html',
        includeNodeLocations: true,
        storageQuota: 10000000
    });
const { window } = dom;

test('Prepare Vitual DOM for `sessionStorage` testing', function () {
    expect(window.document.querySelector('p').textContent).toBe('Hello world');
    expect(window.location.href).toBe('https://github.com/nferocious76/web-storage-manager');

    window.sessionStorage.setItem('npmjs', 'web-storage-manager');
    const testVal = window.sessionStorage.getItem('npmjs');
    expect(testVal).toBe('web-storage-manager');
});

const LocalStorage = new WebStore(window.sessionStorage);