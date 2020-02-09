import { Component, OnInit } from '@angular/core';
import { URL_CONFIG } from '../../../config/url-config';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

declare let $: any;

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss']
})
export class BookDetailsComponent implements OnInit {
  book;
  imageUrl = URL_CONFIG.bookUrl;
  bookId;
  error: string;
  reviewForm: FormGroup;
  reviewClicked: boolean;
  submitted: boolean;
  isLoading: boolean;
  showError;
  reviews: any = [];
  successMessage;

  constructor(private http: HttpClient,
              private route: ActivatedRoute,
              private userService: UserService,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.bookId = this.route.snapshot.paramMap.get('id');
    this.getDetails();
    this.getBookReviews();
  }

  getDetails() {
    this.http.get(URL_CONFIG.bookDetails + '/' + this.bookId)
      .subscribe((res: any) => {
        this.book = res.book;
      });
  }

  getBookReviews() {
    this.http.get(URL_CONFIG.bookReview + '/' + this.bookId)
      .subscribe((res: any) => {
        console.log(res);
        this.reviews = res.list;
      });
  }

  onRequestBook(book) {
    this.error = '';
    this.successMessage = '';
    if (!this.userService.isLoggedIn()) {
      this.error = 'Please login to request.';
      setTimeout(() => {
        this.error = '';
      }, 5000);
      return;
    }
    this.http.post(URL_CONFIG.requestBook, book)
      .subscribe((res: any) => {
        this.successMessage = 'Request for book sent to admin';
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      });
  }

  onAddReview() {
    if (!this.userService.isLoggedIn()) {
      this.error = 'Please login to add review.';
      setTimeout(() => {
        this.error = '';
      }, 5000);
      return;
    }
    this.createReviewForm();
  }

  get f() {
    return this.reviewForm.controls;
  }

  createReviewForm() {
    this.reviewForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
      rating: ['', [Validators.required]]
    });
    this.reviewClicked = true;
    setTimeout(() => {
      $('#reviewModal').modal('show');
    }, 500);
  }

  onSaveReview() {
    this.submitted = true;
    if (this.reviewForm.valid) {
      const reviewObj = this.reviewForm.value;
      const review = {
        bookId: this.book._id,
        comment: reviewObj.comment,
        rating: reviewObj.rating,
      };
      this.http.post(URL_CONFIG.bookReview, review)
        .subscribe((res) => {
          this.reviewForm.reset();
          $('#reviewModal').modal('hide');
        });
    }
  }
}
