import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    subscription: Subscription;
    isLoggedIn;
    user;

    constructor(private userService: UserService,
                private router: Router) {
        this.subscription = this.userService.userSession$().subscribe(loggedIn => {
            this.isLoggedIn = loggedIn;
            this.getUserDetails();
        });
        // this.subscription = this.userService.userDetails$().subscribe(userDetails => {
        //     this.user = userDetails;
        //     console.log(this.user);
        // });
    }

    ngOnInit() {
        this.getUserDetails();
    }

    getUserDetails() {
        this.user = this.userService.getUserDetails();
        console.log(this.user);
    }

    onLogout() {
        this.isLoggedIn = false;
        this.userService.logout();
        this.router.navigate(['/admin']);
    }
}
