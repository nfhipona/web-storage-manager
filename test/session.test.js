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

const WebStorage = new WebStore(window.sessionStorage);

test('Test Storage API primitive functions: `.setItem`, `.length`, `.key`, `.removeItem`, `.getItem`', function () {
    const isSuccess = WebStorage.setItem('toRemoveKey', 'to-remove-value');
    expect(isSuccess).toBe(true);
    expect(WebStorage.length).toBeGreaterThanOrEqual(1);
    expect(WebStorage.key(1)).not.toBeNull();

    WebStorage.removeItem('toRemoveKey');
    const item = WebStorage.getItem('toRemoveKey');
    expect(item).toBeNull();
});

test('Test `setItem` and `getItem` function', function () {
    const isSuccess = WebStorage.setItem('testKey', 'test-value-1');
    expect(isSuccess).toBe(true);

    const item = WebStorage.getItem('testKey');
    expect(item).toBe('test-value-1');
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

    const isSuccess = WebStorage.setItem('testKey', testObject);
    expect(isSuccess).toBe(true);

    const item = WebStorage.getItem('testKey');
    expect(item).not.toBeNull();

    const item2 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyA');
    expect(item2).toBe('nestedKeyA-target-value');

    const item3 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC');
    expect(item3).toMatchObject({ itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' });

    const item4 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { name: 'itemKey2' });
    expect(item4).toBe('itemKey2-target-value');

    // this method targets object with property [name] `id` with [value] of `id3`.
    const item5 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { name: 'id', value: 'id3' });
    expect(item5).toMatchObject({ id: 'id3' });
});

test('Test `setMultipleItems` function', function () {
    // NOTE:
    // this function does not utilize keypath.
    const items = [
        { key: 'item1Key', value: 'item1Value' },
        { key: 'item2Key', value: ['item2AValue', 'item2BValue', 'item2CValue'] },
        { key: 'item3Key', value: { item3AKey: 'item3BValue', item3BKey: 'item3BValue' } }
    ];
    const isSuccess = WebStorage.setMultipleItems(items);
    expect(isSuccess).toBe(true);

    const item1 = WebStorage.getItem('item1Key');
    expect(item1).toBe('item1Value');

    const item2 = WebStorage.getItem('item2Key');
    expect(item2).toMatchObject(['item2AValue', 'item2BValue', 'item2CValue']);

    const item3 = WebStorage.getItem('item3Key');
    expect(item3).toMatchObject({ item3AKey: 'item3BValue', item3BKey: 'item3BValue' });
});

test('Test `removeMultipleItems` function', function () {
    // NOTE:
    // this function utilizes keypath. however, it is not fully supported.
    // it is advised to use `removeItemInItem` with `attrCompare` parameter.

    const item1 = WebStorage.getItem('item1Key');
    expect(item1).not.toBeNull();

    const item2 = WebStorage.getItem('item2Key');
    expect(item2).not.toBeNull();

    const item3 = WebStorage.getItem('item3Key');
    expect(item3).not.toBeNull();

    WebStorage.removeMultipleItems(['item1Key', 'item2Key', 'item3Key']);

    const item1a = WebStorage.getItem('item1Key');
    expect(item1a).toBeNull();

    const item2a = WebStorage.getItem('item2Key');
    expect(item2a).toBeNull();

    const item3a = WebStorage.getItem('item3Key');
    expect(item3a).toBeNull();
});

test('Test `getMultipleItems` function', function () {
    // NOTE:
    // this utilizes keypath. however, 
    // it is recommended to use `getItemInItem` for a more granular key search with `attrCompare`.
    const results = WebStorage.getMultipleItems([
        'testKey.nestedKey.nestedKeyA',
        'testKey.nestedKey.nestedKeyB.nestedKeyC',
        'testKey.nestedKey.nestedKeyB.nestedKeyD'
    ]);
    expect(results).toMatchObject([
        'nestedKeyA-target-value',
        { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
        [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
    ]);
});

test('Test `appendItemInItem` function', function () {
    // NOTE: reference `testObject` in `getItemInItem` function test.
    /**
     *  const testObject = {
     *      nestedKey: {
     *          nestedKeyA: 'nestedKeyA-target-value',
     *          nestedKeyB: {
     *              nestedKeyC: { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
     *              nestedKeyD: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
     *          }
     *      }
     *  };
     */
    const isSuccess1 = WebStorage.appendItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { appendItemInItemAKey: 'appendItemInItemA-target-appended-value' });
    expect(isSuccess1).toBe(true);

    const isSuccess2 = WebStorage.appendItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { id: 'id4', value: 'appendItemInItemB-target-appended-value' });
    expect(isSuccess2).toBe(true);

    const result1 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC');
    expect(result1).toMatchObject({ itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value', appendItemInItemAKey: 'appendItemInItemA-target-appended-value' });

    const result2 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD');
    expect(result2).toMatchObject([{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }, { id: 'id4', value: 'appendItemInItemB-target-appended-value' }]);
});

test('Test `updateItemInItem` function', function () {
    // NOTE: reference `testObject` in `getItemInItem` function test.
    /**
     *  const testObject = {
     *      nestedKey: {
     *          nestedKeyA: 'nestedKeyA-target-value',
     *          nestedKeyB: {
     *              nestedKeyC: { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
     *              nestedKeyD: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
     *          }
     *      }
     *  };
     */

    const isSuccess1 = WebStorage.updateItemInItem('testKey.nestedKey.nestedKeyA', null, 'nestedKeyA-target-updated-value');
    expect(isSuccess1).toBe(true);

    const isSuccess2 = WebStorage.updateItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { name: 'appendItemInItemAKey' }, 'appendItemInItemA-target-appended-updated-value');
    expect(isSuccess2).toBe(true);

    const isSuccess3 = WebStorage.updateItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { name: 'id', value: 'id4' }, { id: 'id4', value: 'appendItemInItemB-target-appended-updated-value' });
    expect(isSuccess3).toBe(true);

    const result1 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyA');
    expect(result1).toBe('nestedKeyA-target-updated-value');

    const result2 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { name: 'appendItemInItemAKey' });
    expect(result2).toBe('appendItemInItemA-target-appended-updated-value');

    const result3 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { name: 'id', value: 'id4' });
    expect(result3).toMatchObject({ id: 'id4', value: 'appendItemInItemB-target-appended-updated-value' });
});

test('Test `removeItemInItem` function', function () {
    // NOTE: reference `testObject` in `updateItemInItem` function test.
    /**
     *  const testObject = {
     *      nestedKey: {
     *          nestedKeyA: 'nestedKeyA-target-value',
     *          nestedKeyB: {
     *              nestedKeyC: { itemKey: 'itemKey-value', itemKey2: 'itemKey2-target-value' },
     *              nestedKeyD: [{ id: 'id1' }, { id: 'id2' }, { id: 'id3' }, { id: 'idz' }]
     *          }
     *      }
     *  };
     */
    const isSuccess1 = WebStorage.removeItemInItem('testKey.nestedKey.nestedKeyA');
    expect(isSuccess1).toBe(true);

    const isSuccess2 = WebStorage.removeItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC', { name: 'itemKey2' });
    expect(isSuccess2).toBe(true);

    const isSuccess3 = WebStorage.removeItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD', { name: 'id', value: 'id3' });
    expect(isSuccess3).toBe(true);

    const result1 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyA');
    expect(result1).toBeUndefined();

    const result2 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyC');
    expect(result2).toMatchObject({ itemKey: 'itemKey-value', appendItemInItemAKey: 'appendItemInItemA-target-appended-updated-value' });

    const result3 = WebStorage.getItemInItem('testKey.nestedKey.nestedKeyB.nestedKeyD');
    expect(result3).toMatchObject([{ id: 'id1' }, { id: 'id2' }, { id: 'idz' }, { id: 'id4', value: 'appendItemInItemB-target-appended-updated-value' }]);
});

test('Test `clear` function', function () {
    WebStorage.clear();
    expect(WebStorage.length).toBe(0);
});