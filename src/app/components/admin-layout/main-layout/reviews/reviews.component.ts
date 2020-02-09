import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_CONFIG } from '../../../../config/url-config';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  reviews = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getReviews();
  }

  getReviews() {
    this.http.get(URL_CONFIG.bookReview)
      .subscribe((res: any) => {
        console.log(res);
        this.reviews = res.list;
      }, err => {
        console.log(err);
      });
  }

  acceptReview(review) {
    this.http.put(URL_CONFIG.acceptReview, {review})
      .subscribe((res: any) => {
        console.log(res);
        this.getReviews();
        // this.requests[index].status = request.status;
      });
  }

  rejectReview(review) {
    this.http.put(URL_CONFIG.rejectReview, {review})
      .subscribe((res: any) => {
        console.log(res);
        this.getReviews();
      });
  }

}
