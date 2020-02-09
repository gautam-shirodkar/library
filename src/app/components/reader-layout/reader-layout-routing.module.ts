import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReaderLayoutComponent } from './reader-layout.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { MyRequestsComponent } from './my-requests/my-requests.component';


const routes: Routes = [
    {
        path: 'home', component: ReaderLayoutComponent,
        children: [
            {path: '', component: HomeComponent},
            {path: 'book-details/:id', component: BookDetailsComponent},
            {path: 'my-requests', component: MyRequestsComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ReaderLayoutRoutingModule {
}
