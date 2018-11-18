import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import * as momentNs from 'moment'; const moment = momentNs;

import { extendMoment, DateRange } from 'moment-range';

const { range } = extendMoment(moment);

import { CalendarComponent } from '../calendar/calendar.component';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';


describe('Testing CalendarComponent', () => {

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
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

  it('The Calendar Component should initialize', async(() => {
    fixture.detectChanges();

    expect(component).toBeDefined();
  }));

  describe('Test range generation utility functions', () => {
    it('calling getWeekNumbers() should return an array of the weeks of the year for the given range of months', async(() => {
      let firstDay = moment([2018, 0]).startOf('month');
      let endDay = moment([2018, 1]).add(1, 'month').endOf('month');
      let monthRange = range(firstDay, endDay);

      let weekNumbers = component.getWeekNumbers(monthRange);
      let expectedWeeks: number[] = [1, 2, 3, 4, 5];

      expect(weekNumbers).toEqual(expectedWeeks);


      firstDay = moment([2018, 1]).startOf('month');
      endDay = moment([2018, 2]).add(1, 'month').endOf('month');
      monthRange = range(firstDay, endDay);
      weekNumbers = component.getWeekNumbers(monthRange);
      expectedWeeks = [5, 6, 7, 8, 9];

      expect(weekNumbers).toEqual(expectedWeeks);
    }));
  });
});
