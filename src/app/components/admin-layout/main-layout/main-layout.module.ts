import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainLayoutRoutingModule } from './main-layout-routing.module';
import { MainLayoutComponent } from './main-layout.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { BooksComponent } from './books/books.component';
import { ReadersComponent } from './readers/readers.component';
import { LibrariansComponent } from './librarians/librarians.component';
import { ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BookDetailsComponent } from './books/book-details/book-details.component';
import { RequestsComponent } from './requests/requests.component';
import { ReviewsComponent } from './reviews/reviews.component';

@NgModule({
    declarations: [MainLayoutComponent,
        HeaderComponent,
        SidebarComponent,
        FooterComponent,
        BooksComponent,
        ReadersComponent,
        LibrariansComponent,
        BookDetailsComponent,
        RequestsComponent,
        ReviewsComponent],
    imports: [
        CommonModule,
        MainLayoutRoutingModule,
        ReactiveFormsModule,
        NgbModule
    ]
})
export class MainLayoutModule {
}
