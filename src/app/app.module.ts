import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxDateRangeModule } from '../modules/ngx-daterange/src/ngx-daterange.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    NgxDateRangeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
