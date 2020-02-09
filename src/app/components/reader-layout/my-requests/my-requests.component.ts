import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../config/url-config';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-my-requests',
    templateUrl: './my-requests.component.html',
    styleUrls: ['./my-requests.component.scss']
})
export class MyRequestsComponent implements OnInit {
    requests = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.getRequests();
    }

    getRequests() {
        this.http.get(URL_CONFIG.userRequests)
            .subscribe((res: any) => {
                console.log(res);
                console.log(this.requests);
                this.requests = res.requests;
            }, err => {
                console.log(err);
            });
    }
}
