import { Injectable } from '@angular/core';
import { STORAGE_TYPE } from '../config/app-config';

@Injectable({
    providedIn: 'root'
})
export class StorageService {

    constructor() {
    }

    encodeData(data) {
        return btoa(encodeURIComponent(data));
    }

    decodeData(data) {
        if (data != null) {
            try {
                return JSON.parse(decodeURIComponent(atob(data)));
            } catch (e) {
            }
        }
    }

    removeStorage(KEY) {
        STORAGE_TYPE.removeItem(KEY);
    }

    clearStorage() {
        STORAGE_TYPE.clear();
    }

    storeData(key, data) {
        STORAGE_TYPE.setItem(key, this.encodeData(JSON.stringify(data)));
    }

    getData(key) {
        return this.decodeData(STORAGE_TYPE.getItem(key));
    }

}
