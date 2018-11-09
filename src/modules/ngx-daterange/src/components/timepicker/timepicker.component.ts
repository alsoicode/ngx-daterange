import { Component, Input, Output, EventEmitter, OnChanges, SimpleChange, SimpleChanges, OnInit } from "@angular/core";
import * as moment_ from 'moment';
const moment = moment_;

import { ITimePickerOptions } from '../../interfaces';

@Component({
  selector: 'time-picker',
  templateUrl: './timepicker.component.html',
})
export class TimePickerComponent implements OnInit, OnChanges {

  @Input()
  options: ITimePickerOptions;

  @Input()
  selectedFromDate: moment_.Moment;

  @Input()
  selectedToDate: moment_.Moment;

  @Input()
  minDate: moment_.Moment;

  @Input()
  maxDate: moment_.Moment;

  @Input()
  format: string;

  @Input()
  isLeft: boolean;

  @Output()
  timeChanged = new EventEmitter<moment_.Moment>();

  ngOnInit(): void {
    if (!this.options.minuteInterval || this.options.minuteInterval % 60 === 0) {
      this.options.minuteInterval = 1;
    }

    this.options.minuteInterval = this.options.minuteInterval % 60;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const selectedFromDateChange: SimpleChange = changes['selectedFromDate'];
    const selectedToDateChange: SimpleChange = changes['selectedToDate'];
    const maxDateChange: SimpleChange = changes['maxDate'];
    const minDateChange: SimpleChange = changes['minDate'];

    if (selectedFromDateChange) {
      this.selectedFromDate = moment_(selectedFromDateChange.currentValue, this.format);
    }

    if (selectedToDateChange) {
      this.selectedToDate = moment_(selectedToDateChange.currentValue, this.format);
    }

    if (maxDateChange) {
      this.maxDate = moment_(maxDateChange.currentValue, this.format);
    }

    if (minDateChange) {
      this.minDate = moment_(minDateChange.currentValue, this.format);
    }
  }

  formatTimeValue(value: number): string {
    return isNaN(value) ? '&mdash;' : (value > 9 ? value.toString() : `0${ value }`)
  }

  getCurrentHour(): string {
    let currentHour = null;

    if (this.selectedFromDate || this.selectedToDate) {
      currentHour = this.isLeft ? this.selectedFromDate.get('hour') : this.selectedToDate.get('hour');
    }

    return this.formatTimeValue(currentHour);
  }

  getCurrentMinute(): string {
    let currentMinute = null;

    if (this.selectedFromDate || this.selectedToDate) {
      currentMinute = this.isLeft ? this.selectedFromDate.get('minute') : this.selectedToDate.get('minute');
    }

    return this.formatTimeValue(currentMinute);
  }

  addHour(value: number): void {
    if (this.isLeft) {
      this.selectedFromDate.set({
        hour: (this.selectedFromDate.get('hour') + value) % 24
      });
    }
    else {
      this.selectedToDate.set({
        hour: (this.selectedToDate.get('hour') + value) % 24
      });
    }

    this.triggerTimeChanged();
  }

  addMinute(value: number): void {
    if (this.isLeft) {
      this.selectedFromDate.set({
        minute: (this.selectedFromDate.get('minute') + value) % 60
      });
    }
    else {
      this.selectedToDate.set({
        minute: (this.selectedToDate.get('minute') + value) % 60
      });
    }

    this.triggerTimeChanged();
  }

  isValidToAdd(unit: moment_.unitOfTime.All, value: number): boolean {
    const interval = unit === 'hour' ? 24 : 60;
    const unitPlural: moment_.unitOfTime.All = unit === 'minute' ? 'minutes' : 'hour';

    let possibleNewValue;
    let possibleSelectedDate;

    if (this.isLeft) {
      if (this.selectedFromDate) {
        possibleNewValue = this.selectedFromDate.get(unit) + value;
        possibleSelectedDate = this.selectedFromDate.clone().add(value, unitPlural);
      }
    }
    else {
      if (this.selectedToDate) {
        possibleNewValue = this.selectedToDate.get(unit) + value;
        possibleSelectedDate = this.selectedToDate.clone().add(value, unitPlural);
      }
    }

    let returnValue = false;

    if (possibleNewValue) {
      returnValue = possibleNewValue < interval && possibleNewValue >= 0;

      if (this.minDate.isValid()) {
        returnValue = returnValue && possibleSelectedDate.isSameOrAfter(this.minDate);
      }

      if (this.maxDate.isValid()) {
        returnValue = returnValue && possibleSelectedDate.isSameOrBefore(this.maxDate);
      }
    }

    return returnValue;
  }

  triggerTimeChanged(): void {
    this.timeChanged.emit(this.isLeft ? this.selectedFromDate : this.selectedToDate);
  }
}
