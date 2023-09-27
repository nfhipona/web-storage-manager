import { CryptorOption, KeyOption, ReturnOption, CryptorModel, VectorIV } from './interface';
export declare const CryptorDefaults: CryptorOption;
export declare class Cryptor implements CryptorModel {
    #private;
    constructor(options?: CryptorOption, ivHex?: VectorIV);
    get settings(): CryptorOption;
    get key(): KeyOption;
    get ivHex(): KeyOption;
    encrypt(subject: string): ReturnOption;
    decrypt(encrypted: string): ReturnOption;
}
