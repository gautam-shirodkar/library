import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../config/url-config';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  bookList = [];
  imageUrl = URL_CONFIG.bookUrl;
  searchBook: string;

  constructor(private http: HttpClient,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getBooks();
  }

  gotToBook(book) {
    this.router.navigate(['book-details/' + book._id], {relativeTo: this.activatedRoute});
    // this.router.navigate();
    // this.router.navigate(['book-details/' + book.id]);
    // routerLink = 'book-details/{{book._id}}';
  }

  getBooks() {
    this.http.get(URL_CONFIG.bookList)
      .subscribe((res: any) => {
        this.bookList = res.list;
        console.log(this.bookList);
      });
  }

  searchBooks() {
    this.http.get(URL_CONFIG.searchBook + '/' + this.searchBook)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
