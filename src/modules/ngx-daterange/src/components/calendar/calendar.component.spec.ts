import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import * as momentNs from 'moment'; const moment = momentNs;

import { extendMoment, DateRange } from 'moment-range';

const { range } = extendMoment(moment);

import { CalendarComponent } from '../calendar/calendar.component';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';


describe('Testing CalendarComponent', () => {

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarComponent,
        FormatMomentDatePipe,
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CalendarComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('The Calendar Component should initialize', waitForAsync(() => {
    fixture.detectChanges();

    expect(component).toBeDefined();
  }));

  describe('Test range generation utility functions', () => {
    it('should return an array of the weeks of the year for the given range of months when calling getWeekNumbers()', waitForAsync(() => {
      let firstDay = moment([2018, 0]).startOf('month');
      let endDay = moment([2018, 1]).add(1, 'month').endOf('month');
      let monthRange = range(firstDay, endDay);

      let weekNumbers = component.getWeekNumbers(monthRange);
      let expectedWeeks: number[] = [1, 2, 3, 4, 5, 6];

      expect(weekNumbers).toEqual(expectedWeeks);


      firstDay = moment([2018, 1]).startOf('month');
      endDay = moment([2018, 2]).add(1, 'month').endOf('month');
      monthRange = range(firstDay, endDay);
      weekNumbers = component.getWeekNumbers(monthRange);
      expectedWeeks = [5, 6, 7, 8, 9, 10];

      expect(weekNumbers).toEqual(expectedWeeks);
    }));

    it('should return an array of DateRange objects when calling getWeeksRange() for the specified week numbers', waitForAsync(() => {
      const weeksRange: DateRange[] = component.getWeeksRange([1, 2, 3, 4, 5, 6]);

      expect(weeksRange.length).not.toEqual(0);
    }));

    it('should crete a list of weeks when calling createCalendarGridData()', waitForAsync(() => {
      component.year = moment().year();
      component.month = moment().month();
      component.createCalendarGridData();

      expect(component.weekList.length).toEqual(6);
    }));
  });

  describe('Test day comparison methods that return CSS classes', () => {
    describe('isDisabled()', () => {
      it('should be true if the day is before the minDate', waitForAsync(() => {
        component.minDate = moment();

        const day = moment().subtract(1, 'day');

        expect(component.isDisabled(day)).toBe(true);
      }));

      it('should be true if the day is after the maxDate', waitForAsync(() => {
        component.maxDate = moment().add(1, 'day');

        const day = moment().add(2, 'day');

        expect(component.isDisabled(day)).toBe(true);
      }));

      it('should be true if the day is before the selectedFromDate and the calendar is not the left/from calendar', waitForAsync(() => {
        component.isLeft = false;
        component.selectedFromDate = moment().subtract(1, 'day');

        const day = moment().subtract(2, 'days');

        expect(component.isDisabled(day)).toBe(true);
      }));
    });
  });
});
