const {
    scryptSync,
    randomFill,
    randomFillSync,
    createCipheriv,
    createDecipheriv
} = await import('node:crypto');

import {
    CryptorConfig,
    BinaryLike,
    CryptorModel,
    VectorIV
} from './interface';

export const CryptorDefaults: CryptorConfig = {
    salt: 'salty',
    byteLength: 64,
    algorithm: 'aes-256-cbc',
    password: 'encrypted-web-storage-manager'
}

export class Cryptor implements CryptorModel {
    #options: CryptorConfig;
    #encryptionKey: BinaryLike;
    #vector: BinaryLike;

    constructor(options: CryptorConfig = CryptorDefaults, ivHex: VectorIV = null) {
        this.#options = options;
        this.#encryptionKey = '';
        this.#vector = ivHex ? Buffer.from(ivHex, 'hex') : '';

        if (!!this.#vector) {
            this.#createKey();
        }
    }

    #createKey(): void {
        const { salt, byteLength, password } = this.#options;
        this.#encryptionKey = scryptSync(password, salt, byteLength);
        this.#vector = randomFillSync(new Uint8Array(16));
    }

    get ivHex(): string {
        return this.#vector.toString();
    }

    encrypt(subject: string): string {
        const { algorithm } = this.#options;
        const cipher = createCipheriv(algorithm, this.#encryptionKey, this.#vector);
        let encrypted = cipher.update(subject, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }

    decrypt(encrypted: string): string {
        const { algorithm } = this.#options;
        const decipher = createDecipheriv(algorithm, this.#encryptionKey, this.#vector);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
}