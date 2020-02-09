import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../../config/url-config';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-requests',
    templateUrl: './requests.component.html',
    styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {

    requests = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.getRequests();
    }

    getRequests() {
        this.http.get(URL_CONFIG.requestsList)
            .subscribe((res: any) => {
                console.log(res);
                this.requests = res.list;
            }, err => {
                console.log(err);
            });
    }

    acceptRequest(request) {
        this.http.put(URL_CONFIG.acceptRequest, {request})
            .subscribe((res: any) => {
                console.log(res);
                this.getRequests();
                // this.requests[index].status = request.status;
            });
    }

    rejectRequest(request) {
        this.http.put(URL_CONFIG.rejectRequest, {request})
            .subscribe((res: any) => {
                console.log(res);
                this.getRequests();
            });
    }

}
