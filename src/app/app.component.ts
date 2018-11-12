import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { IDateRangePickerOptions } from '../modules/ngx-daterange/src/interfaces';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  firstFieldOptions: IDateRangePickerOptions = {
    format: 'MM/DD/YYYY',
    icons: 'material',
    minDate: moment().subtract(2, 'years'),
    maxDate: moment(),
    validators: [Validators.required],
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
    validators: [Validators.required],
  }

  form: FormGroup = null;

  // fromDate = moment().startOf('week');
  // toDate = moment().endOf('week');

  constructor (
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    // setup "parent" form group for the date piker instance to add itself to.
    this.form = this.formBuilder.group({});
  }
}
