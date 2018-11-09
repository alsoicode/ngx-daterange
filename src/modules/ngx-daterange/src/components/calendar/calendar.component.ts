import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import * as moment_ from 'moment';
import { extendMoment, DateRange } from 'moment-range';
import { IChangedData, IDateRange, ITimePickerOptions } from '../../interfaces';

const moment = moment_;
const { range } = extendMoment(moment);

@Component({
    selector: 'calendar',
    templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnChanges {
    @Input()
    month: number;

    @Input()
    year: number;

    @Input()
    selectedFromDate: moment_.Moment;

    @Input()
    selectedToDate: moment_.Moment;

    @Input()
    isLeft: boolean;

    @Input()
    format: string;

    @Input()
    minDate: moment_.Moment;

    @Input()
    maxDate: moment_.Moment;

    @Input()
    inactiveBeforeStart: boolean;

    @Input()
    disableBeforeStart: boolean;

    @Input()
    timePickerOptions: ITimePickerOptions = null;

    @Input()
    singleCalendar = false;

    @Output()
    dateChanged = new EventEmitter<IChangedData>();

    @Output()
    monthChanged = new EventEmitter<IChangedData>();

    @Output()
    yearChanged = new EventEmitter<IChangedData>();

    weekList: IDateRange[];

    get monthText() {
      return moment.monthsShort()[this.month];
    }

    ngOnChanges(): void {
      this.createCalendarGridData();
    }

    getWeekNumbers(monthRange: DateRange): number[] {
      const weekNumbers = [];

      Array.from(monthRange.by('weeks')).forEach((week: moment_.Moment, index: number) => {
        if (index < 6) {
          weekNumbers.push(week.week());
        }
      });

      return weekNumbers;
    }

    getWeeksRange(weeks: number[]): DateRange[] {
      const weeksRange = [];

      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i];
        let firstWeekDay;
        let lastWeekDay;

        if (i > 0 && week < weeks[i - 1]) {
          firstWeekDay = moment([this.year, this.month]).add(1, 'year').week(week).day(0);
          lastWeekDay = moment([this.year, this.month]).add(1, 'year').week(week).day(6);
        }
        else {
          firstWeekDay = moment([this.year, this.month]).week(week).day(0);
          lastWeekDay = moment([this.year, this.month]).week(week).day(6);
        }

        weeksRange.push(range(firstWeekDay, lastWeekDay));
      }

      return weeksRange;
    }

    createCalendarGridData(): void {
      const startDate = moment([this.year, this.month]);
      const firstDay = moment(startDate).startOf('month');
      const endDay = moment(startDate).add(1, 'month').endOf('month');
      const monthRange = range(firstDay, endDay);
      const weeksRange = this.getWeeksRange(this.getWeekNumbers(monthRange));
      const weekList = [];

      weeksRange.map(week => {
        const daysList = [];

        Array.from(week.by('days')).forEach((day: moment_.Moment) => {
          if (day.isSame(this.minDate, 'date')) {
            day = this.minDate;
          }
          else if (day.isSame(this.maxDate, 'date')) {
            day = this.maxDate;
          };

          daysList.push(day);
        });

        weekList.push(daysList);
      });

      this.weekList = weekList;
  }

    isDisabled(day: moment_.Moment): boolean {
      return (day.isBefore(this.minDate) || day.isAfter(this.maxDate)) || (day.isBefore(this.selectedFromDate) && this.disableBeforeStart && !this.isLeft);
    }

    isDateAvailable(day: moment_.Moment): boolean {
      if (day.get('month') !== this.month) {
        return false;
      }

      if (this.inactiveBeforeStart && day.isBefore(this.selectedFromDate, 'date')) {
        return false;
      }

      return true;
    }

    isSelectedDate(day: moment_.Moment): boolean {
      if (day.get('month') === this.month && day.isSame(this.selectedFromDate, 'date')) {
        return true;
      }

      if (day.get('month') === this.month && day.isSameOrAfter(this.selectedFromDate, 'date') && day.isSameOrBefore(this.selectedToDate, 'date')) {
        return true;
      }
    }

    dateSelected(data: IChangedData): void {
      this.dateChanged.emit({
        day: data.day,
        isLeft: this.isLeft
      });
    }

    monthSelected(data: IChangedData): void {
      this.monthChanged.emit({
        value: data.value,
        isLeft: this.isLeft
      });
    }

    yearSelected(data: IChangedData): void {
      this.yearChanged.emit({
        value: data.value,
        isLeft: this.isLeft
      });
    }
}
