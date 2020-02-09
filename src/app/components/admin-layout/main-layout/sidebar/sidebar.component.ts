import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

    userType;
    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userType = this.userService.getUserDetails().userType;
    }

}
