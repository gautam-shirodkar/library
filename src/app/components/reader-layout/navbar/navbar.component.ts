import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { URL_CONFIG } from '../../../config/url-config';
import { StorageService } from '../../../services/storage.service';
import { STORAGE_KEYS } from '../../../config/storage-config';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';

declare let $: any;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoading: boolean;
  submitted: boolean;
  showLoginError: boolean;
  showRegistrationError: boolean;
  loginClicked: boolean;
  registerClicked: boolean;
  signUpError: boolean;
  showPassword = false;
  subscription: Subscription;
  isLoggedIn;
  user: any;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              private storageService: StorageService,
              private userService: UserService) {
    this.subscription = this.userService.userSession$().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
    this.subscription = this.userService.userDetails$().subscribe(userDetails => {
      this.user = userDetails;
    });
  }

  ngOnInit() {
    this.isLoggedIn = this.userService.isLoggedIn();
    if (this.isLoggedIn) {
      this.getUserDetails();
    }
  }

  clickListener(type) {
    type === 'login' ? this.createLoginForm() : this.createRegisterForm();
  }

  createLoginForm() {
    $('#registerModal').modal('hide');
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.loginClicked = true;
    setTimeout(() => {
      $('#loginModal').modal('show');
    }, 500);
  }

  onLogout() {
    this.userService.logout();
  }

  createRegisterForm() {
    $('#loginModal').modal('hide');
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.registerClicked = true;
    setTimeout(() => {
      $('#registerModal').modal('show');
    }, 500);
  }

  get f() {
    return this.loginForm.controls;
  }

  get r() {
    return this.registerForm.controls;
  }

  onLogin() {
    this.http.post(URL_CONFIG.userLogin, this.loginForm.value)
      .subscribe((res: any) => {
        console.log(res);
        this.storageService.storeData(STORAGE_KEYS.USER_TOKEN, res.token);
        setTimeout(() => {
          this.getUserDetails();
        }, 500);
      });
  }

  getUserDetails() {
    this.http.get(URL_CONFIG.userDetails)
      .subscribe((res: any) => {
        this.storageService.storeData(STORAGE_KEYS.USER_DETAILS, res.user);
        this.userService.changeLoginSession(true);
        this.userService.changeUserDetails(res.user);
        $('#loginModal').modal('hide');
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.http.post(URL_CONFIG.addUser, this.registerForm.value)
        .subscribe((res: any) => {
          console.log(res);
          this.isLoading = false;
          this.submitted = false;
          $('#registerModal').modal('hide');
        }, err => {
          this.isLoading = false;
          this.submitted = false;
          this.signUpError = true;
        });
    }
  }
}
