import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { BooksComponent } from './main-layout/books/books.component';
import { LibrariansComponent } from './main-layout/librarians/librarians.component';
import { ReadersComponent } from './main-layout/readers/readers.component';
import { combineAll } from 'rxjs/operators';
import { BookDetailsComponent } from './main-layout/books/book-details/book-details.component';
import { AuthGuard } from '../guards/auth.guard';
import { RequestsComponent } from './main-layout/requests/requests.component';
import { ReviewsComponent } from './main-layout/reviews/reviews.component';


const routes: Routes = [
  {
    path: 'admin', component: AdminLayoutComponent,
    children: [
      {path: '', component: LoginComponent},
      {
        path: '', component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {path: 'books', component: BooksComponent},
          {path: 'book-details/:id', component: BookDetailsComponent},
          {path: 'librarians', component: LibrariansComponent},
          {path: 'readers', component: ReadersComponent},
          {path: 'requests', component: RequestsComponent},
          {path: 'reviews', component: ReviewsComponent}
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule {
}
