import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import * as moment from 'moment';

import { CalendarComponent } from '../calendar/calendar.component';
import { DateRangePickerComponent } from './date-range-picker.component';
import { defaultDateRangePickerOptions } from '../constants';
import { IDateRangePickerOptions } from '../../interfaces';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';

describe('Testing DateRangePickerComponent', () => {

  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

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
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should instantiate with default options if none are provided', () => {
    expect(component).toBeDefined();
    component.options = defaultDateRangePickerOptions;

    Object.keys(defaultDateRangePickerOptions).forEach((key: string) => {
      expect(component.options[key]).toEqual(defaultDateRangePickerOptions[key]);
    });
  });

  it('should instantiate with provided option value over defaults if provided', () => {
    const options: IDateRangePickerOptions = {
      format: 'MM/DD/YYYY',
      icons: 'material',
      minDate: moment().subtract(1, 'year'),
      maxDate: moment().add(1, 'year'),
    };

    component.options = options;

    Object.keys(options).forEach((key: string) => {
      expect(component.options[key]).toEqual(options[key]);
    })
  });
});
