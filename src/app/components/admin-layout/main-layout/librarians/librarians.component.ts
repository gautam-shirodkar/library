import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { URL_CONFIG } from '../../../../config/url-config';

declare let $: any;

@Component({
    selector: 'app-librarians',
    templateUrl: './librarians.component.html',
    styleUrls: ['./librarians.component.scss']
})
export class LibrariansComponent implements OnInit {
    librarianForm: FormGroup;
    addClicked   = false;
    submitted    = false;
    isLoading    = false;
    showPassword = false;
    signupError: boolean;
    list         = [];

    constructor(private http: HttpClient,
                private formBuilder: FormBuilder) {
    }

    ngOnInit() {
        this.getLibrarians();
    }

    getLibrarians() {
        this.http.get(URL_CONFIG.librariansList)
            .subscribe((res: any) => {
                console.log(res);
                this.list = res.list;
            }, err => {
                console.log(err);
            });
    }

    togglePassword() {
        this.showPassword = !this.showPassword;
    }

    generatePassword() {
        this.showPassword  = true;
        // this.librarianForm.
        const tempPassword = Math.random().toString(36).slice(-8);
        console.log(tempPassword);
        this.librarianForm.patchValue({password: tempPassword});
    }

    addLibrarianClickListener() {
        this.createSignUpForm();
    }


    createSignUpForm() {
        this.librarianForm = this.formBuilder.group({
            firstName: ['', [Validators.required]],
            lastName: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', [Validators.required]],
            password: ['', [Validators.required]]
        });
        this.addClicked    = true;
        setTimeout(() => {
            $('#addLibrarian').modal('show');
        }, 500);
    }

    get f() {
        return this.librarianForm.controls;
    }

    onSignUp() {
        this.submitted = true;
        if (this.librarianForm.valid) {
            this.isLoading = true;
            this.http.post(URL_CONFIG.addLibrarian, this.librarianForm.value)
                .subscribe((res: any) => {
                    console.log(res);
                    this.isLoading = false;
                    this.submitted = false;
                    res.user.id    = res.user._id;
                    const user     = {...res.user};
                    delete user._id;
                    this.list.push(user);
                    $('#addLibrarian').modal('hide');
                }, err => {
                    this.isLoading   = false;
                    this.submitted   = false;
                    this.signupError = true;
                });
        }
    }

    activateUser(user) {
        this.http.put(URL_CONFIG.librarianStatus, {user})
            .subscribe((res: any) => {
                console.log(res);
                const index             = this.list.findIndex(p => p.id === user.id);
                this.list[index].id     = res.user.id;
                this.list[index]._rev   = res.user._rev;
                this.list[index].status = !user.status;
            });
    }

    deleteUser(user) {
        this.http.put(URL_CONFIG.librarianRemove, {user})
            .subscribe((res: any) => {
                const index = this.list.findIndex(p => p.id === user.id);
                this.list.splice(index, 1);
            });
    }
}
