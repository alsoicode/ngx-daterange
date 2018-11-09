import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgxDateRangeModule } from '../modules/ngx-daterange/src/ngx-daterange.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxDateRangeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
