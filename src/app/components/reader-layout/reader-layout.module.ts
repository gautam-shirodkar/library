import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReaderLayoutRoutingModule } from './reader-layout-routing.module';
import { ReaderLayoutComponent } from './reader-layout.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BookDetailsComponent } from './book-details/book-details.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';


@NgModule({
  declarations: [ReaderLayoutComponent, NavbarComponent, FooterComponent, HomeComponent, BookDetailsComponent, MyRequestsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ReaderLayoutRoutingModule
  ]
})
export class ReaderLayoutModule {
}
