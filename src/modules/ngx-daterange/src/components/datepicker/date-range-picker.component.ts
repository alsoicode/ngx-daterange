import { Component, Input, Output, EventEmitter, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { defaultDateRangePickerOptions } from '../../constants';
import { IDateRange, IDateRangePickerOptions, IDefinedDateRange, IChangedData } from '../../interfaces';

import * as momentNs from 'moment'; const moment = momentNs;

let instanceCount = 0;

@Component({
  encapsulation: ViewEncapsulation.Emulated,
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
  datepickerReset = new EventEmitter<any>();

  @Output()
  rangeSelected = new EventEmitter<IDateRange>();

  defaultRanges: IDefinedDateRange[];
  isMobile = false;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
  range = '';
  showCalendars = false;
  displayStyle: boolean = false;

  get enableApplyButton(): boolean {
    let enabled = !this.options.autoApply && this.fromDate !== null;

    if (this.options.singleCalendar) {
      return enabled;
    }

    return enabled && this.toDate !== null;
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLInputElement;

    // close the DatePicker if clicking outside is not allowed
    if (!this.options.clickOutsideAllowed) {
      let targetPathClassNames: string[] = [];

      try {
        targetPathClassNames = event.composedPath().map((obj: EventTarget) => obj['className']) || [''];
      }
      catch (error) {
        // IE / Edge
        targetPathClassNames = event['path'].map(obj => obj.className);
      }

      let containerElementClassRoot = this.options.modal === true ? 'dateRangePickerModal' : 'dateRangePicker';
      
      const targetExistsInPath = targetPathClassNames.some(className => {
        if (typeof className === 'string') {
          return className && className.includes(containerElementClassRoot);
        }

        return false;
      });

      if (!targetExistsInPath) {
        this.toggleCalendarVisibility(false);
      }
    }

    // Close the DatePicker if the target input was clicked
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
    if (navigator) {
      if (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i)) {
        this.isMobile = true;
      }
    }

    // ensure dates in options are valid
    this.validateOptionDates();

    // ensure input dates are within the min/max dates in options
    this.validateInputDates();

    if (this.options.preDefinedRanges && this.options.preDefinedRanges.length > 0) {
      this.defaultRanges = this.validateAndAssignPredefinedRanges(this.options.preDefinedRanges);
    }

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
    const value = this.formatRangeAsString();
    const control = new FormControl({ value, disabled: this.options.disableInputDisplay }, this.options.validators);

    if (this.options.disabled) {
      control.disable();
    }

    this.parentFormGroup.addControl(this.controlName, control);

    // set value of control
    this.setRange();
  }

  validateInputDates(): void {
    if (typeof this.fromDate === 'string') {
      this.fromDate = moment(this.fromDate);
    }

    if (typeof this.toDate === 'string') {
      this.toDate = moment(this.toDate);
    }

    if (this.fromDate && this.options.minDate && this.fromDate.isBefore(this.options.minDate, 'date')) {
      throw new RangeError('@Input fromDate is before the specified minDate in options');
    }

    if (this.toDate && this.options.maxDate && this.toDate.isAfter(this.options.maxDate, 'date')) {
      throw new RangeError('@Input toDate is after the specified maxDate in options');
    }
  }

  validateOptionDates(): void {
    // validate maxDate isn't before minDate or vice versa
    if (this.options) {
      if (this.options.minDate && this.options.maxDate) {
        if (this.options.minDate.isAfter(this.options.maxDate, 'date')) {
          throw new RangeError('minDate specified in options is after the maxDate');
        }
        else if (this.options.maxDate.isBefore(this.options.minDate, 'date')) {
          throw new RangeError('maxDate specified in options is before the minDate');
        }
      }
    }
  }

  // assists CSS to fix small positioning bug with From:/To: date text
  checkChrome(): string {
    return window['chrome'] ? 'is-chrome' : '';
  }

  toggleCalendarVisibility(value?: boolean): void {
    if(this.options.modal === true) {
      this.displayStyle = value !== null ? value === false ? false : true : this.showCalendars === false ? false : true;
    }
    else {
      this.showCalendars = value !== null ? value : !this.showCalendars;
    }
  }1

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

  // update from/to based on selection
  dateChanged(changedData: IChangedData): void {
    const value = changedData.day;
    const isLeft = changedData.isLeft;

    if (isLeft) {
      this.fromDate = value;

      if (this.fromDate.isAfter(this.toDate, 'date')) {
        this.toDate = this.fromDate.clone();
      }
    }
    else {
      this.toDate = value;

      if (this.toDate.isBefore(this.fromDate, 'date')) {
        this.fromDate = this.toDate.clone();
      }
    }

    this.setFromToMonthYear(this.fromDate, this.toDate);

    if (this.options.autoApply && (this.toDate || this.options.singleCalendar)) {
      this.toggleCalendarVisibility(false);
      this.setRange();
      this.emitRangeSelected();
    }
  }

  emitRangeSelected(data?: IDateRange): void {
    if (!data) {
      data = this.options.singleCalendar ? { start: this.fromDate } : { start: this.fromDate, end: this.toDate };
    }

    this.rangeSelected.emit(data);
  }

  getMoment(value): momentNs.Moment {
    return moment(value, this.options.format);
  }

  formatRangeAsString(): string {
    let range = '';

    if (this.options.singleCalendar && this.fromDate) {
      if (typeof this.fromDate === 'string') {
        this.fromDate = moment(this.fromDate);
      }

      range = this.fromDate.format(this.options.format);
    }
    else if (!this.options.singleCalendar && this.fromDate && this.toDate) {
      if (typeof this.fromDate === 'string') {
        this.fromDate = moment(this.fromDate);
      }

      if (typeof this.toDate === 'string') {
        this.toDate = moment(this.toDate);
      }

      range = `${ this.fromDate.format(this.options.format) } - ${ this.toDate.format(this.options.format) }`;
    }

    return range;
  }

  setRange(): void {
    this.range = this.formatRangeAsString();

    if (this.parentFormGroup) {
      const control = this.parentFormGroup.get(this.controlName);

      if (control) {
        control.setValue(this.range);
        control.updateValueAndValidity();
      }
    }
  }

  setDateFromInput(event: {event: Event, isLeft: boolean}): void {
    const isLeft = event.isLeft;
    const target = event.event.target as HTMLInputElement;

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

          if (this.fromDate && this.toDate) {
            this.setFromToMonthYear(this.fromDate, this.toDate);

            if (!this.options.autoApply) {
              this.emitRangeSelected();
            }
          }
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
      temp = moment([this.fromYear, this.fromMonth]).add(data.value, 'month');
      this.fromMonth = temp.get('month');
      this.fromYear = temp.get('year');
    }
    else {
      temp = moment([this.toYear, this.toMonth]).add(data.value, 'month');
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
    this.setRange();
    this.datepickerReset.emit();

    event.stopPropagation();
  }

  apply(event: Event): void {
    this.toggleCalendarVisibility(false);
    this.setRange();
    this.emitRangeSelected();

    event.stopPropagation();
  }

  applyPredefinedRange(event: {event: Event, definedDateRange: IDefinedDateRange}): void {
    // adjust to/from month/year so calendar months and years match range
    this.setFromToMonthYear(event.definedDateRange.value.start, event.definedDateRange.value.end);

    this.fromDate = event.definedDateRange.value.start;
    this.toDate = event.definedDateRange.value.end;

    if (this.options.autoApply) {
      this.apply(event.event);
    }
  }

  validateAndAssignPredefinedRanges(ranges: IDefinedDateRange[]): IDefinedDateRange[] {
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
}
