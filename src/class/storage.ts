import { Storage } from './interface';

export class WebStorage {
    #storage: Storage;
    constructor(storage: Storage) {
        this.#storage = storage;
    }
}