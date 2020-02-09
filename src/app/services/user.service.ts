import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Observable, Subject } from 'rxjs';
import { STORAGE_KEYS } from '../config/storage-config';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private userSession = new Subject<any>();
    private userDetails = new Subject<any>();

    constructor(private storageService: StorageService) {
    }

    isLoggedIn() {
        const data = this.storageService.getData(STORAGE_KEYS.USER_TOKEN);
        return (data !== null && data !== undefined);
    }

    getUserId(): number {
        return this.storageService.getData(STORAGE_KEYS.USER_DETAILS) ? this.storageService.getData(STORAGE_KEYS.USER_DETAILS).user_id : null;
    }

    getUserToken() {
        return this.storageService.getData(STORAGE_KEYS.USER_TOKEN);
    }

    getUserDetails() {
        return this.storageService.getData(STORAGE_KEYS.USER_DETAILS);
    }

    changeLoginSession(login: boolean) {
        this.userSession.next(login);
    }

    userSession$(): Observable<any> {
        return this.userSession.asObservable();
    }

    changeUserDetails(user: any) {
        this.userDetails.next(user);
    }

    userDetails$(): Observable<any> {
        return this.userDetails.asObservable();
    }

    logout() {
        this.storageService.removeStorage(STORAGE_KEYS.USER_TOKEN);
        this.storageService.removeStorage(STORAGE_KEYS.USER_DETAILS);
        this.changeLoginSession(false);
    }
}
