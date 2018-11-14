import { CommonModule } from '@angular/common';
import { NgZone } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { MockNgZone } from '../../mocks/ng-zone.mock';
import * as moment from 'moment';

import { CalendarComponent } from '../calendar/calendar.component';
import { DateRangePickerComponent } from './date-range-picker.component';
import { defaultDateRangePickerOptions } from '../../constants';
import { IDateRangePickerOptions } from '../../interfaces';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';

describe('Testing DateRangePickerComponent', () => {

  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;
  const mockNgZone = jasmine.createSpyObj('mockNgZone', [ 'run', 'runOutsideAngular' ]);
  mockNgZone.run.and.callFake(fn => fn());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarComponent,
        DateRangePickerComponent,
        FormatMomentDatePipe,
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      // providers: [
      //   { provide: NgZone, useValue: mockNgZone },
      // ]
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DateRangePickerComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('The NgxDateRangePicker Component should initialize', () => {
    expect(component).toBeDefined();
  });

  it('should use default options if options are not provided', () => {
    Object.keys(defaultDateRangePickerOptions).forEach((key: string) => {
      expect(component.options[key]).toEqual(defaultDateRangePickerOptions[key]);
    });
  });

  it('should use options over defaults if provided', () => {
    const options: IDateRangePickerOptions = {
      format: 'MM/DD/YYYY',
      icons: 'material',
      minDate: moment().subtract(1, 'year'),
      maxDate: moment().add(1, 'year'),
    };

    component.options = options;

    // Ensure options provided override defaults
    Object.keys(options).forEach((key: string) => {
      expect(component.options[key]).toEqual(options[key]);
    });
  });

  it('should throw an error if the minDate is after the maxDate', () => {
    const options: IDateRangePickerOptions = {
      format: 'MM/DD/YYYY',
      minDate: moment().add(1, 'year'),
      maxDate: moment(),
    };

    component.options = options;

    expect(fixture.detectChanges).toThrow(new RangeError());
  })
});
