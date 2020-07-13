import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateRangePickerComponent } from './components/datepicker/date-range-picker.component';
import { FormatMomentDatePipe } from './pipes/format-moment-date.pipe';
import { WINDOW_PROVIDERS } from './services/window.service';

const declarations = [
  CalendarComponent,
  DateRangePickerComponent,
  FormatMomentDatePipe,
];

@NgModule({
  declarations: [ ...declarations ],
  exports: [ ...declarations ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    WINDOW_PROVIDERS,
  ],
})
export class NgxDateRangeModule {}
