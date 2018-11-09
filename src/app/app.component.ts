import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

import { IDateRangePickerOptions } from '../modules/ngx-daterange/src/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  options: IDateRangePickerOptions = {
    alwaysOpen: false,
    startDate: null,
    endDate: null,
    format: 'MM/DD/YYYY',
    minDate: moment().subtract(2, 'years'),
    maxDate: moment(),
    inactiveBeforeStart: true,
    autoApply: true,
    singleCalendar: false,
    displayFormat: 'MM/DD/YYYY',
    position: 'left',
    disabled: false,
    noDefaultRangeSelected: true,
    disableBeforeStart: true,
    timePickerOptions: null,
    validators: [Validators.required]
  }

  form: FormGroup = null;

  constructor (
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    // setup "parent" form group for the date piker instance to add itself to.
    this.form = this.formBuilder.group({});
  }
}
