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
  parentFormGroup: FormGroup = null;

  @Input()
  fromDate: momentNs.Moment;

  @Input()
  toDate: momentNs.Moment;

  @Output()
  rangeSelected = new EventEmitter<IDateRange>();

  private instanceId: string;

  defaultRanges: IDefinedDateRange[];
  enableApplyButton = false;
  format: string;
  fromMonth: number;
  fromYear: number;
  labelText: string;
  toMonth: number;
  toYear: number;
  range = '';
  showCalendars = false;

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (this.elementRef.nativeElement.contains(event.target)) {
      this.toggleCalendarVisibility(!this.showCalendars);
    }
  }

  constructor(
    private elementRef: ElementRef
  ) {
    this.instanceId = `dateRangePicker-${ instanceCount++ }`;
  }

  ngOnInit(): void {
    // get default options provided by user
    this.setFormat();
    this.validateMinMaxDates();
    this.setFromDate(this.fromDate || this.options.startDate);
    this.setToDate(this.toDate || this.options.endDate);
    this.defaultRanges = this.validatePredefinedRanges(this.options.preDefinedRanges || defaultDateRanges.ranges);
    this.labelText = this.options.labelText || defaultDateRangePickerOptions.labelText;

    // update calendar grid
    this.updateCalendar();

    // add form control to parent form group
    if (this.parentFormGroup) {
      const control = new FormControl('', this.options.validators);

      if (this.options.disabled) {
        control.disable();
      }

      this.parentFormGroup.addControl(this.controlName, control);

      this.setRange();
    }
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

  setFormat() {
    this.format = this.options.format || defaultDateFormat;
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

      if (this.options.minDate && (this.options.minDate as momentNs.Moment).format(defaultTimeFormat) === '00:00') {
        (this.options.minDate as momentNs.Moment).set({
          hour: 0,
          minutes: 0,
          seconds: 0
        });
      }

      if (this.options.maxDate && (this.options.maxDate as momentNs.Moment).format(defaultTimeFormat) === '00:00') {
        (this.options.maxDate as momentNs.Moment).set({
          hour: 23,
          minutes: 59,
          seconds: 59
        });
      }
    }
  }

  setFromDate(value: momentNs.Moment): void {
    this.fromDate = value ? value : null;
  }

  setToDate(value: momentNs.Moment): void {
    this.toDate = value ? value : null;
  }

  getActualFromDate(value) {
    let temp;

    if (temp = this.getValidateMoment(value)) {
      return this.getValidateFromDate(temp);
    }
    else {
      return this.getValidateFromDate(moment());
    }
  }

  getValidateFromDate(value) {
    if (!this.options.timePickerOptions) {
      if (this.options.minDate && this.options.maxDate && value.isSameOrAfter(this.options.minDate, 'date') && value.isSameOrBefore(this.options.maxDate, 'date')) {
        return value;
      }
      else if (this.options.minDate && !this.options.maxDate && value.isAfter(this.options.minDate, 'date')) {
        return value;
      }
      else if (this.options.minDate) {
        return (this.options.minDate as momentNs.Moment).clone();
      }
      else {
        return moment();
      }
    }
    else {
      if (this.options.minDate && this.options.maxDate && value.isSameOrAfter(this.options.minDate, this.options.format) && value.isSameOrBefore(this.options.maxDate, this.options.format)) {
        return value;
      }
      else if (this.options.minDate && !this.options.maxDate && value.isAfter(this.options.minDate, this.options.format)) {
        return value;
      }
      else if (this.options.minDate) {
        return (this.options.minDate as momentNs.Moment).clone();
      }
      else {
        return moment();
      }
    }
  }

  getActualToDate(value: momentNs.Moment): momentNs.Moment {
    let temp;

    if (temp = this.getValidateMoment(value)) {
      return this.getValidateToDate(temp);
    }
    else {
      return this.getValidateToDate(moment());
    }
  }

  getValidateToDate(value: momentNs.Moment): momentNs.Moment {
    const granularity = this.options.timePickerOptions ? null : 'date';

    if (this.options.maxDate && value.isSameOrAfter(this.fromDate, granularity), value.isSameOrBefore(this.options.maxDate, granularity)) {
      return value;
    }
    else if (this.options.maxDate) {
      return (this.options.maxDate as momentNs.Moment).clone();
    }
    else {
      return moment();
    }
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

      if (!this.options.timePickerOptions) {
        if (value.isBefore(this.fromDate, 'date')) {
          this.fromDate = this.toDate.clone();
        }
      }
      else {
        if (value.isBefore(this.fromDate)) {
          this.fromDate = this.toDate.clone();
        }
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
        start: this.getMoment(this.fromDate)
      };
    }
    else {
      data = {
        start: this.getMoment(this.fromDate),
        end: this.getMoment(this.toDate)
      };
    }

    this.rangeSelected.emit(data);
  }

  getMoment(value): momentNs.Moment {
    return moment(value, this.format);
  }

  getValidateMoment(value): momentNs.Moment | null {
    let momentValue = null;

    if (moment(value, this.format, true).isValid()) {
      momentValue = moment(value, this.format, true);
    }

    return momentValue;
  }

  setRange(): void {
    const displayFormat = this.options.displayFormat || defaultDateFormat;

    if (this.options.singleCalendar && this.fromDate) {
      this.range = this.fromDate.format(displayFormat);
    }
    else if (this.fromDate && this.toDate) {
      this.range = `${ this.fromDate.format(displayFormat) } - ${ this.toDate.format(displayFormat) }`;
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

    if (this.fromDate && target.value !== this.fromDate.format(this.format)) {
      this.dateChanged({
        day: target.value ? this.getMoment(target.value) : moment(),
        isLeft: true
      });
    }
  }

  formatToDate(event: Event): void {
    const target = event.target as HTMLInputElement;

    if (this.toDate && target.value !== this.toDate.format(this.format)) {
      this.dateChanged({
        day: target.value ? this.getMoment(target.value) : moment(),
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

  cancel(event: Event): void {
    this.toggleCalendarVisibility(false);

    event.stopPropagation();
  }

  clear(event: Event): void {
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
