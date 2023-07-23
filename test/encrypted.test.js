const { JSDOM } = require('jsdom');
const { Cryptor } = require('../lib/class/cryptor');
const { EncryptedWebStore } = require('../lib/class/encrypted-storage');

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

const CryptorDefaults = {
    salt: 'salty',
    keyLength: 24,
    algorithm: 'aes-192-cbc',
    password: 'encrypted-web-storage-manager',
    byteLength: 16
};

const cryptor = new Cryptor(CryptorDefaults, null);
const WebStorage = new EncryptedWebStore(window.localStorage, cryptor);

test('Test `Cryptor` class', function () {
    const key = Buffer.from(cryptor.key, 'hex');
    const iv = Buffer.from(cryptor.ivHex, 'hex');
    console.log(`Generated encryptionKey '${cryptor.key}' key:`, key);
    console.log(`Generated vector '${cryptor.ivHex}' iv:`, iv);
    console.log(`Cryptor Settings:`, cryptor.settings);

    expect(cryptor.key).not.toBeNull();
    expect(cryptor.ivHex).not.toBeNull();
    expect(cryptor.settings).not.toBeNull();
});

test('Test Storage API primitive functions: `.setItem`, `.length`, `.key`, `.removeItem`, `.getItem`', function () {
    const isSuccess = WebStorage.setItem('toRemoveKey', 'to-remove-value');
    expect(isSuccess).toBe(true);
    expect(WebStorage.length).toBeGreaterThanOrEqual(1);
    expect(WebStorage.key(1)).not.toBeNull();

    WebStorage.removeItem('toRemoveKey');
    const item = WebStorage.getItem('toRemoveKey');
    expect(item).toBeNull();
});

test('Test `clear` function', function () {
    WebStorage.clear();
    expect(WebStorage.length).toBe(0);
});