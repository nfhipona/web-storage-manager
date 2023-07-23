import * as crypto from "crypto";
import { Buffer } from 'node:buffer';
const {
    scryptSync,
    randomFillSync,
    createCipheriv,
    createDecipheriv
} = crypto;

import {
    CryptorOption,
    KeyOption,
    ReturnOption,
    CryptorModel,
    VectorIV
} from './interface';

export const CryptorDefaults: CryptorOption = {
    salt: 'salty',
    keyLength: 24,
    algorithm: 'aes-192-cbc',
    password: 'encrypted-web-storage-manager',
    byteLength: 16
}

export class Cryptor implements CryptorModel {
    #options: CryptorOption;
    #encryptionKey: KeyOption;
    #vector: KeyOption;

    constructor(options: CryptorOption = CryptorDefaults, ivHex: VectorIV = null) {
        this.#options = options;
        this.#encryptionKey = null;
        this.#vector = ivHex;

        if (!ivHex) {
            this.#createKey();
        }
    }

    #createKey(): void {
        const { salt, keyLength, password, byteLength } = this.#options;
        const key = scryptSync(password, salt, keyLength);
        this.#encryptionKey = key.toString('hex');
        const buf = Buffer.alloc(byteLength);
        randomFillSync(buf);
        this.#vector = buf.toString('hex');
    }

    get settings(): CryptorOption {
        return this.#options
    }

    get key(): KeyOption {
        return this.#encryptionKey;
    }

    get ivHex(): KeyOption {
        return this.#vector;
    }

    encrypt(subject: string): ReturnOption {
        if (this.#encryptionKey && this.#vector) {
            const { algorithm } = this.#options;
            const key = Buffer.from(this.#encryptionKey, 'hex');
            const iv = Buffer.from(this.#vector, 'hex');
            const cipher = createCipheriv(algorithm, key, iv);
            let encrypted = cipher.update(subject, 'utf8', 'hex');
            encrypted += cipher.final('hex');
            return encrypted;
        }

        return null;
    }

    decrypt(encrypted: string): ReturnOption {
        if (!!encrypted && this.#encryptionKey && this.#vector) {
            const { algorithm } = this.#options;
            const key = Buffer.from(this.#encryptionKey, 'hex');
            const iv = Buffer.from(this.#vector, 'hex');
            const decipher = createDecipheriv(algorithm, key, iv);
            let decrypted = decipher.update(encrypted, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        }

        return null;
    }
}