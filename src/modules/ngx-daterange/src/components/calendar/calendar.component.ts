import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

import * as moment_ from 'moment';
import { extendMoment } from 'moment-range';

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
    selectedFromDate: string;

    @Input()
    selectedToDate: string;

    @Input()
    isLeft: boolean;

    @Input()
    format: string;

    @Input()
    minDate: string;

    @Input()
    maxDate: string;

    @Input()
    inactiveBeforeStart: boolean;

    @Input()
    disableBeforeStart: boolean;

    @Input()
    timePicker: any;

    @Input()
    singleCalendar = false;

    @Output()
    dateChanged = new EventEmitter();

    @Output()
    monthChanged = new EventEmitter();

    @Output()
    yearChanged = new EventEmitter();

    weekList: any;

    get monthText() {
      return moment.monthsShort()[this.month];
    }

    ngOnChanges(): void {
      this.createCalendarGridData();
    }

    getWeekNumbers(monthRange: any): number[] {
      const weekNumbers = [];

      Array.from(monthRange.by('weeks')).forEach((week: moment_.Moment, index: number) => {
        if (index < 6) {
          weekNumbers.push(week.week());
        }
      });

      return weekNumbers;
    }

    getWeeksRange(weeks: number[]): any[] {
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
          if (day.isSame(moment(this.minDate, this.format), 'date')) {
            day = moment(this.minDate, this.format);
          }
          else if (day.isSame(moment(this.maxDate, this.format), 'date')) {
            day = moment(this.maxDate, this.format);
          };

          daysList.push(day);
        });

        weekList.push(daysList);
      });

      this.weekList = weekList;
  }

    isDisabled(day: moment_.Moment): boolean {
      return (day.isBefore(moment(this.minDate, this.format)) || day.isAfter(moment(this.maxDate, this.format))) || (day.isBefore(moment(this.selectedFromDate, this.format)) && this.disableBeforeStart && !this.isLeft);
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

    dateSelected(day): void {
      this.dateChanged.emit({
        day: day,
        isLeft: this.isLeft
      });
    }

    monthSelected(value): void {
      this.monthChanged.emit({
        value: value,
        isLeft: this.isLeft
      });
    }

    yearSelected(value): void {
      this.yearChanged.emit({
        value: value,
        isLeft: this.isLeft
      });
    }
}
