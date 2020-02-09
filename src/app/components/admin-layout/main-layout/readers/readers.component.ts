import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../../config/url-config';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-readers',
    templateUrl: './readers.component.html',
    styleUrls: ['./readers.component.scss']
})
export class ReadersComponent implements OnInit {

    list = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.getReaders();
    }

    getReaders() {
        this.http.get(URL_CONFIG.readersList)
            .subscribe((res: any) => {
                console.log(res);
                this.list = res.list;
            }, err => {
                console.log(err);
            });
    }

    activateUser(user) {
        this.http.put(URL_CONFIG.userStatus, {user})
            .subscribe((res: any) => {
                console.log(res);
                const index             = this.list.findIndex(p => p.id === user.id);
                this.list[index].id     = res.user.id;
                this.list[index]._rev   = res.user._rev;
                this.list[index].status = !user.status;
            });
    }

    deleteUser(user) {
        this.http.put(URL_CONFIG.userRemove, {user})
            .subscribe((res: any) => {
                const index = this.list.findIndex(p => p.id === user.id);
                this.list.splice(index, 1);
            });
    }

}
