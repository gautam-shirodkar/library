import { Injectable } from '@angular/core';
// import { ErrorDialogService } from '../error-dialog/errordialog.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { STORAGE_KEYS } from '../config/storage-config';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    // constructor(public errorDialogService: ErrorDialogService) { }
    private apiUrl = 'http://localhost:8080/api/';

    constructor(private userService: UserService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.userService.getUserToken();

        if (token) {
            request = request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)});
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
        // }

        request = request.clone({headers: request.headers.set('Accept', 'application/json')});
        request = request.clone({url: this.apiUrl + request.url});

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                let data = {};
                data     = {
                    reason: error && error.error.reason ? error.error.reason : '',
                    status: error.status
                };
                return throwError(error);
            }));
    }
}
