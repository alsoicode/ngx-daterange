import { Component, Input, Output, EventEmitter, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { defaultDateRangePickerOptions } from '../../constants';
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
  instanceId: string = null;

  @Input()
  parentFormGroup: FormGroup;

  @Input()
  fromDate: momentNs.Moment = null;

  @Input()
  toDate: momentNs.Moment = null;

  @Output()
  rangeSelected = new EventEmitter<IDateRange>();

  defaultRanges: IDefinedDateRange[];
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  range = '';
  showCalendars = false;

  get enableApplyButton(): boolean {
    return !this.options.autoApply && !this.options.singleCalendar && this.fromDate !== null && this.toDate !== null;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.id === this.instanceId) {
      this.toggleCalendarVisibility(!this.showCalendars);
    }
  }

  constructor() {
    if (!this.instanceId) {
      // assign auto-id
      this.instanceId = `dateRangePicker-${ instanceCount++ }`;
    }
  }

  ngOnInit(): void {
    this.setFromDate(this.fromDate);
    this.setToDate(this.toDate);

    if (this.options.preDefinedRanges && this.options.preDefinedRanges.length > 0) {
      this.defaultRanges = this.validatePredefinedRanges(this.options.preDefinedRanges);
    }

    // assign values not present in options with default values
    const optionsKeys = Object.keys(this.options);
    const defaultValuesKeys = Object.keys(defaultDateRangePickerOptions);

    defaultValuesKeys.forEach((key: string) => {
      if (!optionsKeys.includes(key)) {
        this.options[key] = defaultDateRangePickerOptions[key];
      }
    });

    // validate maxDate isn't before minDate or vice versa
    if (this.options && this.options.minDate && this.options.maxDate) {
      if (this.options.minDate.isAfter(this.options.maxDate, 'date')) {
        throw new RangeError('minDate specified in options is after the maxDate');
      }
      else if (this.options.maxDate.isBefore(this.options.minDate, 'date')) {
        throw new RangeError('maxDate specified in options is before the minDate');
      }
    }

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

  setFromToMonthYear(fromDate?: momentNs.Moment, toDate?: momentNs.Moment): void {
    const tempFromDate = fromDate || this.fromDate || moment();
    const tempToDate = toDate || this.toDate || moment();

    this.fromMonth = tempFromDate.get('month');
    this.fromYear = tempFromDate.get('year');

    this.toMonth = tempToDate.get('month');
    this.toYear = tempToDate.get('year');
  }

  updateCalendar(): void {
    // get month and year to show calendar
    this.setFromToMonthYear();

    this.setRange();
  }

  setFromDate(value: momentNs.Moment): void {
    this.fromDate = value ? value : null;
  }

  setToDate(value: momentNs.Moment): void {
    this.toDate = value ? value : null;
  }

  // update from/to based on selection
  dateChanged(changedData: IChangedData): void {
    const value = changedData.day;
    const isLeft = changedData.isLeft;

    if (isLeft) {
      if (!this.options.timePickerOptions) {
        value.set({
          hour: 0,
          minute: 0,
          second: 0
        });
      }

      this.setFromDate(value);

      if (this.fromDate.isAfter(this.toDate, 'date')) {
        this.toDate = this.fromDate.clone();
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

      this.setToDate(value);

      if (this.toDate.isBefore(this.fromDate, 'date')) {
        this.fromDate = this.toDate.clone();
      }
    }

    this.setFromToMonthYear(this.fromDate, this.toDate);

    if (this.isAutoApply() && (this.options.singleCalendar || !isLeft) && this.fromDate) {
      this.toggleCalendarVisibility(false);
      this.setRange();
      this.emitRangeSelected();
    }
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
        control.updateValueAndValidity();
      }
    }
  }

  setDateFromInput(event: Event, isLeft: boolean = false): void {
    const target = event.target as HTMLInputElement;

    try {
      if (target.value) {
        const day = this.getMoment(target.value);

        if (!day.isBefore(this.options.minDate) && !day.isAfter(this.options.maxDate)) {
          if (isLeft && !this.fromDate) {
            this.fromDate = day;
          }

          if (!isLeft && !this.toDate) {
            this.toDate = day;
          }

          this.dateChanged({
            day,
            isLeft,
          });

          this.setFromToMonthYear(this.fromDate, this.toDate);
        }
        else {
          // assume nothing - reset values
          this.fromDate = null;
          this.toDate = null;
          target.value = '';
          target.focus();
        }
      }
    }
    catch (e) {
      console.error(e);
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
    // this.enableApplyButton = false;
    this.setRange();
    this.emitRangeSelected();

    event.stopPropagation();
  }

  apply(event: Event): void {
    this.toggleCalendarVisibility(false);
    this.setRange();
    this.emitRangeSelected();

    event.stopPropagation();
  }

  applyPredefinedRange(event: Event, definedDateRange: IDefinedDateRange): void {
    // adjust to/from month/year so calendar months and years match range
    this.setFromToMonthYear(definedDateRange.value.start, definedDateRange.value.end);

    this.setFromDate(definedDateRange.value.start);
    this.setToDate(definedDateRange.value.end);

    if (this.options.autoApply) {
      this.apply(event);
    }
  }

  validatePredefinedRanges(ranges: IDefinedDateRange[]): IDefinedDateRange[] {
    return ranges.filter(range => {
      if (range.value.start.isAfter(range.value.end, 'date')) {
        throw new RangeError(`Pre-defined range "${ range.name }" start date cannot be after the end date for the range.`);
      }

      if (this.options.minDate && range.value.start.isBefore(this.options.minDate)) {
        throw new RangeError(`Pre-defined range "${ range.name }" start date is before the specified minDate in your options.`);
      }

      if (this.options.maxDate && range.value.end.isAfter(this.options.maxDate)) {
        throw new RangeError(`Pre-defined range "${ range.name }" end date is after the specified maxDate in your options.`);
      }

      // add range to ranges
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
