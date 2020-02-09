import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminLayoutModule } from './components/admin-layout/admin-layout.module';
import { ReaderLayoutModule } from './components/reader-layout/reader-layout.module';
import { HttpConfigInterceptor } from './interceptor/httpconfig.interceptor';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        ReaderLayoutModule,
        AdminLayoutModule
    ],
    providers: [
        {provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
