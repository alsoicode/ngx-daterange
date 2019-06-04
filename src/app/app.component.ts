import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { DateRangePickerComponent } from '../modules/ngx-daterange/src/components/datepicker/date-range-picker.component';
import { IDateRange, IDateRangePickerOptions } from '../modules/ngx-daterange/src/interfaces';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('dateRangePicker', { static: true })
  dateRangePicker: DateRangePickerComponent;

  firstFieldEmittedValue: IDateRange;
  firstFieldOptions: IDateRangePickerOptions = {
    autoApply: false,
    format: 'MM/DD/YYYY',
    icons: 'material',
    minDate: moment().subtract(2, 'years'),
    maxDate: moment(),
    preDefinedRanges: [
      {
        name: 'Last Week',
        value: {
          start: moment().subtract(1, 'week').startOf('week'),
          end: moment().subtract(1, 'week').endOf('week')
        }
      },
      {
        name: 'Two Weeks Ago',
        value: {
          start: moment().subtract(2, 'week').startOf('week'),
          end: moment().subtract(2, 'week').endOf('week')
        }
      }
    ],
    startingFromDate: moment().subtract(1, 'month'),
    startingToDate: moment(),
    validators: Validators.required,
  }

  secondFieldOptions: IDateRangePickerOptions = {
    autoApply: false,
    format: 'MM/DD/YYYY',
    icons: 'font-awesome',
    minDate: moment().subtract(10, 'years'),
    maxDate: moment(),
  }

  rightFieldOptions: IDateRangePickerOptions = {
    format: 'MM/DD/YYYY',
    icons: 'material',
    minDate: moment().subtract(2, 'years'),
    maxDate: moment(),
    position: 'right',
  }

  form: FormGroup = null;

  constructor (
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    // setup "parent" form group for the date piker instance to add itself to.
    this.form = this.formBuilder.group({});
  }

  onRangeSelected(value: IDateRange): void {
    this.firstFieldEmittedValue = value;
    console.log(this.firstFieldEmittedValue);
  }

  onReset(event: Event): void {
    this.dateRangePicker.reset(event);
  }
}
