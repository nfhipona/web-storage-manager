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

test('Prepare Vitual DOM for `localStorage` testing', function () {
    expect(window.document.querySelector('p').textContent).toBe('Hello world');
    expect(window.location.href).toBe('https://github.com/nferocious76/web-storage-manager');

    window.localStorage.setItem('npmjs', 'web-storage-manager');
    const testVal = window.localStorage.getItem('npmjs');
    expect(testVal).toBe('web-storage-manager');
});

const LocalStorage = new WebStore(window.localStorage);

test('Test `setItem` and `getItem` function', function () {
    const isSuccess = LocalStorage.setItem('testKey', 'test-value-1');
    expect(isSuccess).toBe(true);

    const item = LocalStorage.getItem('testKey');
    expect(item).toBe('test-value-1');
});

test('Test Storage API primitive functions', function () {
    const isSuccess = LocalStorage.setItem('toRemoveKey', 'to-remove-value');
    expect(isSuccess).toBe(true);
    expect(LocalStorage.length).toBeGreaterThanOrEqual(1);
    expect(LocalStorage.key(1)).not.toBeNull();

    LocalStorage.removeItem('toRemoveKey');
    const item = LocalStorage.getItem('toRemoveKey');
    expect(item).toBeNull();
});

test('Test `getItemInItem` function', function () {
    const testObject = {
        nestedKey: {
            nestedKeyA: 'nestedKeyA-target-value',
            nestedKeyB: {
                nestedKeyC: { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
                nestedKeyD: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
            }
        }
    };

    const isSuccess = LocalStorage.setItem('testKey', testObject);
    expect(isSuccess).toBe(true);

    const item = LocalStorage.getItem('testKey');
    expect(item).not.toBeNull();

    const item2 = LocalStorage.getItemInItem('testKey.nestedKey.nestedKeyA');
    expect(item2).toBe('nestedKeyA-target-value');

    const item3 = LocalStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC');
    expect(item3).toMatchObject({ itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' });

    const item4 = LocalStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { name: 'itemKey2' });
    expect(item4).toBe('itemKey2-target-value');

    // this method targets object with property [name] `id` with [value] of `id3`.
    const item5 = LocalStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { name: 'id', value: 'id3' });
    expect(item5).toMatchObject({ id: 'id3' });
});

