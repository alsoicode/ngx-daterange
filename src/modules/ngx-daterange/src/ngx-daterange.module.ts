import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateRangePickerComponent } from './components/datepicker/date-range-picker.component';
import { FormatMomentDatePipe } from './pipes/format-moment-date.pipe';

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
  ]
})
export class NgxDateRangeModule {}
