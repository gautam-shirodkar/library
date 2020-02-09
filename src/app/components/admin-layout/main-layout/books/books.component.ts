import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { URL_CONFIG } from '../../../../config/url-config';

declare let $: any;

@Component({
    selector: 'app-books',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

    bookForm: FormGroup;
    imagePreview: any;
    bookError: boolean;
    submitted = false;
    isLoading = false;
    imageUrl  = URL_CONFIG.bookUrl;
    bookList  = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.createBookForm();
        this.getBooks();
    }

    getBooks() {
        this.http.get(URL_CONFIG.bookList)
            .subscribe((res: any) => {
                this.bookList = res.list;
                console.log(this.bookList);
            });
    }

    createBookForm() {
        this.bookForm = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.maxLength(50), Validators.minLength(6)]
            }),
            isbn: new FormControl(null, {validators: [Validators.required, Validators.minLength(10)]}),
            category: new FormControl(null, {validators: [Validators.required]}),
            author: new FormControl(null, {validators: [Validators.required]}),
            publishDate: new FormControl(null, {validators: [Validators.required]}),
            description: new FormControl('', {validators: [Validators.required]}),
            image: new FormControl(null, {validators: [Validators.required]})

        });
    }

    get f() {
        return this.bookForm.controls;
    }


    onPickImage(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.bookForm.patchValue({image: file});
        this.bookForm.get('image').updateValueAndValidity();
        const fileReader  = new FileReader();
        fileReader.onload = () => {
            this.imagePreview = fileReader.result;
        };
        fileReader.readAsDataURL(file);
    }

    addBookClickListener() {
        $('#addBook').modal('show');
    }

    onSaveBook() {
        console.log(this.bookForm.value);
        this.bookError = false;
        this.submitted = true;

        if (this.bookForm.valid) {
            this.isLoading      = false;
            const bookObj       = this.bookForm.value;
            bookObj.publishDate = new Date(bookObj.publishDate.year, bookObj.publishDate.month - 1, bookObj.publishDate.day).toDateString();
            const bookData      = new FormData();
            bookData.append('title', bookObj.title);
            bookData.append('isbn', bookObj.isbn);
            bookData.append('category', bookObj.category);
            bookData.append('author', bookObj.author);
            bookData.append('publishDate', bookObj.publishDate);
            bookData.append('image', bookObj.image, bookObj.title);
            bookData.append('description', bookObj.description);

            this.http.post(URL_CONFIG.addBook, bookData)
                .subscribe((res) => {
                    this.isLoading = false;
                    this.submitted = false;
                    this.bookForm.reset();
                    this.getBooks();
                    $('#addBook').modal('hide');
                }, err => {
                    this.isLoading = false;
                    this.submitted = false;
                    this.bookError = true;
                });
        }
    }
}
