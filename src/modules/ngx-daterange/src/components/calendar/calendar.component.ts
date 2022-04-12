import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
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

  ngOnChanges(changes: SimpleChanges): void {
    // Set the right calendar month and year equal to the left calendar
    // if the left calendar's date if after the right
    if (!this.isLeft) {
      let currentValue = changes?.selectedFromDate?.currentValue as unknown as momentNs.Moment;

      if (currentValue) {
        if (!moment.isMoment(currentValue)) {
          currentValue = moment(currentValue);
        }

        const month: number = currentValue.month();
        const year: number = currentValue.year();

        if (year > this.year || (year === this.year && month > this.month)) {
          this.month = month;
          this.year = year;
        }
      }
    }

    this.createCalendarGridData();
  }

  getWeekNumbers(monthRange: DateRange): number[] {
    const weekNumbers = [];
    const weeks = Array.from(monthRange.by('weeks'));

    for (let i = 0; i < weeks.length; i++) {
      const week = weeks[i];

      if (i < 6) {
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
      const weekNumber = weeks[i];

      let firstWeekDay: momentNs.Moment = moment([this.year, this.month]).week(weekNumber).day(0);
      let lastWeekDay: momentNs.Moment = moment([this.year, this.month]).week(weekNumber).day(6);

      // Set year to the next year if the week number is lower than the starting week
      // this indicates that the week is in January of the next year
      if (weekNumber < weeks[0]) {
        firstWeekDay = moment([this.year + 1, 0]).week(weekNumber).day(0);
        lastWeekDay = moment([this.year + 1, 0]).week(weekNumber).day(6);
      }

      weeksRange.push(range(firstWeekDay, lastWeekDay));
    }

    return weeksRange;
  }

  createCalendarGridData(): void {
    const firstDay = moment([this.year, this.month]).startOf('month');
    const endDay = moment([this.year, this.month]).endOf('month').add(1, 'week');
    const monthRange = range(firstDay, endDay);
    const weeksRange = this.getWeeksRange(this.getWeekNumbers(monthRange));
    const weekList = [];

    weeksRange?.map(week => {
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

    return date && day.isSame(date, 'date');
  }

  isDateInRange(day: momentNs.Moment): boolean {
    if (this.selectedFromDate && this.selectedToDate) {
      const selectedRange = range(this.selectedFromDate, this.selectedToDate);

      return selectedRange.contains(day);
    }

    return false;
  }

  isDifferentMonth(day: momentNs.Moment): boolean {
    return day.get('month') !== this.month;
  }

  dateSelected(event: Event, data: IChangedData): void {
    const target = event.target as HTMLTableCellElement;

    if (!target.classList.contains('disabled')) {
      this.dateChanged.emit({ day: data.day, isLeft: this.isLeft });
    }

    event.stopPropagation();
  }

  monthSelected(event: Event, data: IChangedData): void {
    this.monthChanged.emit({ value: data.value, isLeft: this.isLeft });

    event.stopPropagation();
  }

  yearSelected(event: Event, data: IChangedData): void {
    this.yearChanged.emit({ value: data.value, isLeft: this.isLeft });

    event.stopPropagation();
  }
}
