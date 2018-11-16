import { Component, Input, Output, EventEmitter, OnChanges, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

import * as momentNs from 'moment'; const moment = momentNs;

import { extendMoment, DateRange } from 'moment-range';
import { IChangedData, IDateRange } from '../../interfaces';

const { range } = extendMoment(moment);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'calendar',
  styleUrls: [
    './calendar.component.scss',
  ],
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnChanges {

    @Input()
    month: number;

    @Input()
    year: number;

    @Input()
    selectedFromDate: momentNs.Moment;

    @Input()
    selectedToDate: momentNs.Moment;

    @Input()
    isLeft: boolean;

    @Input()
    format: string;

    @Input()
    minDate: momentNs.Moment;

    @Input()
    maxDate: momentNs.Moment;

    @Input()
    singleCalendar = false;

    @Input()
    icons: string;

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
      const weeks = Array.from(monthRange.by('weeks'));

      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i];

        if (i < 5) {
          weekNumbers.push(week.week());
        }
        else {
          break;
        }
      }

      return weekNumbers;
    }

    getWeeksRange(weeks: number[]): DateRange[] {
      const weeksRange = [];

      for (let i = 0; i < weeks.length; i++) {
        const week = weeks[i];
        let firstWeekDay = moment([this.year, this.month]).week(week).day(0);;
        let lastWeekDay = moment([this.year, this.month]).week(week).day(6);;

        if (i > 0 && week < weeks[i - 1]) {
          firstWeekDay .add(1, 'year');
          lastWeekDay.add(1, 'year');
        }

        weeksRange.push(range(firstWeekDay.week(week).day(0), lastWeekDay.week(week).day(6)));
      }

      return weeksRange;
    }

    createCalendarGridData(): void {
      const firstDay = moment([this.year, this.month]).startOf('month');
      const endDay = moment([this.year, this.month]).add(1, 'month').endOf('month');
      const monthRange = range(firstDay, endDay);
      const weeksRange = this.getWeeksRange(this.getWeekNumbers(monthRange));
      const weekList = [];

      weeksRange.map(week => {
        const daysList = [];

        Array.from(week.by('days')).forEach((day: momentNs.Moment) => {
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

  isDisabled(day: momentNs.Moment): boolean {
    return (day.isBefore(this.minDate) || day.isAfter(this.maxDate)) || (day.isBefore(this.selectedFromDate) && !this.isLeft);
  }

  isDateAvailable(day: momentNs.Moment): boolean {
    if (this.isLeft) {
      return day.isSameOrBefore(this.selectedToDate, 'date') && !day.isSameOrBefore(this.minDate, 'date');
    }

    return day.isSameOrAfter(this.selectedFromDate, 'date') && !day.isSameOrAfter(this.maxDate, 'date');
  }

  isSelectedDate(day: momentNs.Moment): boolean {
    const date = this.isLeft ? this.selectedFromDate : this.selectedToDate;

    return date && day.get('month') === this.month && day.isSame(date, 'date');
  }

  isDateInRange(day: momentNs.Moment): boolean {
    if (this.isLeft) {
      if (!this.selectedToDate) {
        return this.selectedFromDate && day.get('month') === this.month && day.isSameOrAfter(this.selectedFromDate, 'date');
      }
    }

    if (this.selectedFromDate) {
      return this.selectedToDate && day.get('month') === this.month && day.isSameOrBefore(this.selectedToDate, 'date') && day.isSameOrAfter(this.selectedFromDate, 'date');
    }
  }

  isDifferentMonth(day: momentNs.Moment): boolean {
    return day.get('month') !== this.month;
  }

  dateSelected(event: Event, data: IChangedData): void {
    this.dateChanged.emit({
      day: data.day,
      isLeft: this.isLeft
    });

    event.stopPropagation();
  }

  monthSelected(event: Event, data: IChangedData): void {
    this.monthChanged.emit({
      value: data.value,
      isLeft: this.isLeft
    });

    event.stopPropagation();
  }

  yearSelected(event: Event, data: IChangedData): void {
    this.yearChanged.emit({
      value: data.value,
      isLeft: this.isLeft
    });

    event.stopPropagation();
  }
}
