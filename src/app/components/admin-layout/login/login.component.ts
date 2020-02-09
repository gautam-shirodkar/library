import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../config/url-config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { STORAGE_KEYS } from '../../../config/storage-config';
import { UserService } from '../../../services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;
    showLoginError;
    submitted = false;
    isLoading = false;
    isLoggedIn;

    constructor(private formBuilder: FormBuilder,
                private http: HttpClient,
                private router: Router,
                private storageService: StorageService,
                private userService: UserService) {
    }

    ngOnInit() {
        this.isLoggedIn = this.userService.isLoggedIn();
        if (this.isLoggedIn) {
            this.router.navigate(['admin/books']);
        }
        this.createLoginForm();
    }

    get f() {
        return this.loginForm.controls;
    }

    createLoginForm() {
        this.loginForm = this.formBuilder.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
    }

    onLogin() {
        this.showLoginError = false;
        this.submitted      = true;

        if (this.loginForm.valid) {
            console.log('inside login');
            this.isLoading = true;
            this.http.post(URL_CONFIG.userLogin, this.loginForm.value)
                .subscribe((res: any) => {
                        console.log(res);
                        this.isLoading = false;
                        this.storageService.storeData(STORAGE_KEYS.USER_TOKEN, res.token);
                        setTimeout(() => {
                            this.getUserDetails();
                        }, 500);

                    },
                    err => {
                        console.log('failed');
                        this.isLoading      = false;
                        this.showLoginError = true;
                        setTimeout(() => {
                            this.showLoginError = false;
                        }, 3000);
                    });
        }
    }

    getUserDetails() {
        this.http.get(URL_CONFIG.userDetails)
            .subscribe((res: any) => {
                this.loginForm.reset();
                this.storageService.storeData(STORAGE_KEYS.USER_DETAILS, res.user);
                this.userService.changeLoginSession(true);
                this.userService.changeUserDetails(res.user);
                setTimeout(() => {
                    this.router.navigate(['admin/books']);
                }, 500);
            });
    }
}
