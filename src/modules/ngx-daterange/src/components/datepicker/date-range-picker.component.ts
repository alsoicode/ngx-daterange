import { Component, ElementRef, Input, Output, EventEmitter, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { defaultDateRangePickerOptions, defaultDateRanges, defaultDateFormat, defaultTimeFormat } from '../constants';
import { IDateRange, IDateRangePickerOptions, IDefinedDateRange, IChangedData } from '../../interfaces';

import * as momentNs from 'moment'; const moment = momentNs;

let instanceCount = 0;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'date-range-picker',
  styleUrls: [
    './date-range-picker.component.scss',
  ],
  templateUrl: './date-range-picker.component.html',
})
export class DateRangePickerComponent implements OnInit {

  @Input()
  options: IDateRangePickerOptions = defaultDateRangePickerOptions;

  @Input()
  controlName: string = 'dateRange';

  @Input()
  parentFormGroup: FormGroup;

  @Input()
  fromDate: momentNs.Moment;

  @Input()
  toDate: momentNs.Moment;

  @Output()
  rangeSelected = new EventEmitter<IDateRange>();

  defaultRanges: IDefinedDateRange[];
  enableApplyButton = false;
  fromMonth: number;
  instanceId: string;
  fromYear: number;
  toMonth: number;
  toYear: number;
  range = '';
  showCalendars = false;

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.id === this.instanceId) {
      this.toggleCalendarVisibility(!this.showCalendars);
    }
  }

  constructor(
    private elementRef: ElementRef
  ) {
    this.instanceId = `dateRangePicker-${ instanceCount++ }`;
  }

  ngOnInit(): void {
    this.validateMinMaxDates();
    this.setFromDate(this.fromDate);
    this.setToDate(this.toDate);
    this.defaultRanges = this.validatePredefinedRanges(this.options.preDefinedRanges || defaultDateRanges.ranges);

    // assign values not present in options with default values
    const optionsKeys = Object.keys(this.options);
    const defaultValuesKeys = Object.keys(defaultDateRangePickerOptions);

    defaultValuesKeys.forEach((key: string) => {
      if (!optionsKeys.includes(key)) {
        this.options[key] = defaultDateRangePickerOptions[key];
      }
    });

    // update calendar grid
    this.updateCalendar();

    // create parent form group if it doesn't exist
    if (!this.parentFormGroup) {
      this.parentFormGroup = new FormGroup({});
    }

    // add form control to parent form group
    const control = new FormControl('', this.options.validators);

    if (this.options.disabled) {
      control.disable();
    }

    this.parentFormGroup.addControl(this.controlName, control);

    // sets value of control
    this.setRange();
  }

  checkChrome(): string {
    return window['chrome'] ? 'is-chrome' : '';
  }

  toggleCalendarVisibility(value?: boolean): void {
    this.showCalendars = value;
  }

  updateCalendar(): void {
    // get month and year to show calendar

    const tempFromDate = this.fromDate || moment();
    const tempToDate = this.toDate || moment();

    this.fromMonth = tempFromDate.get('month');
    this.fromYear = tempFromDate.get('year');

    this.toMonth = tempToDate.get('month');
    this.toYear = tempToDate.get('year');

    this.setRange();
  }

  validateMinMaxDates() {
    if (this.options) {
      // only mindate is suppplied
      if (this.options.minDate && !this.options.maxDate) {
        this.options.minDate = this.getMoment(this.options.minDate);
      }

      // only maxdate is supplied
      if (!this.options.minDate && this.options.maxDate) {
        this.options.maxDate = this.getMoment(this.options.maxDate);
      }

      // both min and max dates are supplied
      if (this.options.minDate && this.options.maxDate) {
        this.options.minDate = this.getMoment(this.options.minDate);
        this.options.maxDate = this.getMoment(this.options.maxDate);

        if (this.options.maxDate.isBefore(this.options.minDate, 'date')) {
          this.options.minDate = null;
          this.options.maxDate = null;
          console.warn('Supplied minDate is after maxDate. Discarding options for minDate and maxDate.');
        }
      }

      if (this.options.minDate && this.options.minDate.format(defaultTimeFormat) === '00:00') {
        this.options.minDate.set({
          hour: 0,
          minutes: 0,
          seconds: 0
        });
      }

      if (this.options.maxDate && this.options.maxDate.format(defaultTimeFormat) === '00:00') {
        this.options.maxDate.set({
          hour: 23,
          minutes: 59,
          seconds: 59
        });
      }
    }
  }

  apply(event: Event): void {
    this.toggleCalendarVisibility(false);
    this.setRange();
    this.emitRangeSelected();

    event.stopPropagation();
  }

  setFromDate(value: momentNs.Moment): void {
    this.fromDate = value ? value : null;
  }

  setToDate(value: momentNs.Moment): void {
    this.toDate = value ? value : null;
  }

  // detects which date to set from or to and validates
  dateChanged(data: IChangedData): void {
    const value = data.day;
    const isLeft = data.isLeft;

    if (isLeft) {
      if (!this.options.timePickerOptions) {
        value.set({
          hour: 0,
          minute: 0,
          second: 0
        });
      }

      this.fromDate = value;

      if (!this.options.timePickerOptions) {
        if (value.isAfter(this.toDate, 'date')) {
          this.toDate = this.fromDate.clone();
        }
      }
      else {
        if (value.isAfter(this.toDate)) {
          this.toDate = this.fromDate.clone();
        }
      }
    }
    else {
      if (!this.options.timePickerOptions) {
        value.set({
          hour: 23,
          minute: 59,
          second: 59
        });
      }

      this.toDate = value;

      if (value.isBefore(this.fromDate, 'date')) {
        this.fromDate = this.toDate.clone();
      }
    }

    if (this.isAutoApply()) {
      if (this.options.singleCalendar || !isLeft && this.fromDate) {
        this.toggleCalendarVisibility(false);
        this.setRange();
        this.emitRangeSelected();
      }
    }
    else if (!this.options.singleCalendar && !isLeft) {
      this.enableApplyButton = true;
    }
    else if (this.options.singleCalendar) {
      this.enableApplyButton = true;
    }

    this.fromMonth = this.fromDate ? this.fromDate.get('month') : this.fromMonth;
    this.toMonth = this.toDate ? this.toDate.get('month') : this.toMonth;
  }

  emitRangeSelected(): void {
    let data: IDateRange;

    if (this.options.singleCalendar) {
      data = {
        start: this.fromDate,
      };
    }
    else {
      data = {
        start: this.fromDate,
        end: this.toDate,
      };
    }

    this.rangeSelected.emit(data);
  }

  getMoment(value): momentNs.Moment {
    return moment(value, this.options.format);
  }

  setRange(): void {
    if (this.options.singleCalendar && this.fromDate) {
      this.range = this.fromDate.format(this.options.format);
    }
    else if (this.fromDate && this.toDate) {
      this.range = `${ this.fromDate.format(this.options.format) } - ${ this.toDate.format(this.options.format) }`;
    }
    else {
      this.range = '';
    }

    if (this.parentFormGroup) {
      const control = this.parentFormGroup.get(this.controlName);

      if (control) {
        control.setValue(this.range);
      }
    }
  }

  formatFromDate(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.fromDate && target.value && target.value !== this.fromDate.format(this.options.format)) {
      this.dateChanged({
        day: this.getMoment(target.value),
        isLeft: true
      });
    }
  }

  formatToDate(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.toDate && target.value && target.value !== this.toDate.format(this.options.format)) {
      this.dateChanged({
        day: this.getMoment(target.value),
        isLeft: false
      });
    }
  }

  monthChanged(data: IChangedData): void {
    let temp;

    if (data.isLeft) {
      temp = moment([this.fromYear, this.fromMonth]).add(data.value, 'months');
      this.fromMonth = temp.get('month');
      this.fromYear = temp.get('year');
    }
    else {
      temp = moment([this.toYear, this.toMonth]).add(data.value, 'months');
      this.toMonth = temp.get('month');
      this.toYear = temp.get('year');
    }
  }

  yearChanged(data: IChangedData): void {
    let temp;

    if (data.isLeft) {
      temp = moment([this.fromYear, this.fromMonth]).add(data.value, 'year');
      this.fromMonth = temp.get('month');
      this.fromYear = temp.get('year');
    }
    else {
      temp = moment([this.toYear, this.toMonth]).add(data.value, 'year');
      this.toMonth = temp.get('month');
      this.toYear = temp.get('year');
    }
  }

  close(event: Event): void {
    this.toggleCalendarVisibility(false);

    event.stopPropagation();
  }

  reset(event: Event): void {
    this.fromDate = null;
    this.toDate = null;
    this.enableApplyButton = false;
    this.setRange();
    this.emitRangeSelected();

    event.stopPropagation();
  }

  applyPredefinedRange(data: IDefinedDateRange): void {
    this.setFromDate(data.value.start);
    this.setToDate(data.value.end);
    this.toggleCalendarVisibility(false);
    this.emitRangeSelected();
  }

  validatePredefinedRanges(ranges: IDefinedDateRange[]): IDefinedDateRange[] {
    return ranges.filter(range => {
      if (range.value.start.isAfter(range.value.end, 'date')) {
        return false;
      }

      if (this.options.minDate && range.value.start.isBefore(this.options.minDate)) {
        return false;
      }

      if (this.options.maxDate && range.value.end.isAfter(this.options.maxDate)) {
        return false;
      }

      return true;
    });
  }

  isAutoApply(): boolean {
    if (this.options.timePickerOptions) {
      return false;
    }
    else if (this.options.singleCalendar) {
      return true;
    }
    else {
      return this.options.autoApply;
    }
  }
}
