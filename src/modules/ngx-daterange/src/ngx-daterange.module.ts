import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarComponent } from './components/calendar/calendar.component';
import { DateRangePickerComponent } from './components/datepicker/date-range-picker.component';
import { FormatMomentDatePipe } from './pipes/format-moment-date.pipe';
import { ManualInputsComponent } from './components/manual-inputs/manual-inputs.component';
import { PredefinedDateRangesComponent } from './components/predefined-date-ranges/predefined-date-ranges.component';

const declarations = [
  CalendarComponent,
  DateRangePickerComponent,
  FormatMomentDatePipe,
  ManualInputsComponent,
  PredefinedDateRangesComponent
];

@NgModule({
  declarations: [ ...declarations ],
  exports: [ ...declarations ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class NgxDateRangeModule {}
