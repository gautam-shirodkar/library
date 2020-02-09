import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLayoutRoutingModule } from './admin-layout-routing.module';
import { AdminLayoutComponent } from './admin-layout.component';
import { LoginComponent } from './login/login.component';
import { MainLayoutModule } from './main-layout/main-layout.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        AdminLayoutComponent,
        LoginComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AdminLayoutRoutingModule,
        MainLayoutModule
    ]
})
export class AdminLayoutModule {
}
