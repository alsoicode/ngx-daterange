import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'
import * as moment from 'moment';

import { CalendarComponent } from '../calendar/calendar.component';
import { DateRangePickerComponent } from './date-range-picker.component';
import { defaultDateRangePickerOptions } from '../../constants';
import { IDateRangePickerOptions } from '../../interfaces';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';

const simpleOptions: IDateRangePickerOptions = {
  format: 'MM/DD/YYYY',
  minDate: moment().subtract(1, 'year'),
  maxDate: moment().add(1, 'year'),
  singleCalendar: false,
  preDefinedRanges: null,
}

describe('Testing DateRangePickerComponent', () => {

  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(waitForAsync(() => {
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
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(DateRangePickerComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('The NgxDateRangePicker Component should initialize', waitForAsync(() => {
    fixture.detectChanges();

    expect(component).toBeDefined();
  }));

  describe('Testing options', () => {
    it('should use default options if options are not provided', waitForAsync(() => {
      fixture.detectChanges();

      Object.keys(defaultDateRangePickerOptions).forEach((key: string) => {
        expect(component.options[key]).toEqual(defaultDateRangePickerOptions[key]);
      });
    }));

    it('should use options over defaults if provided', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, { icons: 'material', minDate: moment().subtract(1, 'month'), maxDate: moment() });
      component.options = options;

      fixture.detectChanges();

      // Ensure options provided override defaults
      Object.keys(options).forEach((key: string) => {
        expect(component.options[key]).toEqual(options[key]);
      });
    }));

    it('should throw an error if the minDate is after the maxDate', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, { minDate: moment().add(1, 'year'), maxDate: moment() });

      component.options = options;

      expect(() => fixture.detectChanges()).toThrow();
    }));

    it('should throw an error if the @Input fromDate is before the options.minDate', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
        minDate: moment().subtract(1, 'month'),
        maxDate: moment(),
        singleCalendar: false,
        preDefinedRanges: null,
      });

      component.options = options;
      component.fromDate = moment().subtract(2, 'months');
      expect(() => fixture.detectChanges()).toThrow();
    }));

    it('should throw an error if the @Input toDate is after the options.maxDate', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
        minDate: moment().subtract(1, 'month'),
        maxDate: moment(),
        singleCalendar: false,
        preDefinedRanges: null,
      });

      component.options = options;
      component.toDate = moment().add(2, 'months');
      expect(() => fixture.detectChanges()).toThrow();
    }));

    it('should disable the input element if options.disableInputDisplay is true', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
        disableInputDisplay: true,
        minDate: moment().subtract(1, 'month'),
        maxDate: moment(),
        singleCalendar: false,
        preDefinedRanges: null,
      });

      component.options = options;
      fixture.detectChanges();

      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      expect(input.disabled).toBeTrue();
    }));

    describe('Pre-Defined Range Tests', () => {
      it('should throw an error if the range start value is after the range end value', waitForAsync(() => {
        const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
          minDate: moment().subtract(1, 'month'),
          maxDate: moment(),
          singleCalendar: false,
          preDefinedRanges: [
            {
              name: 'Test Defined Range',
              value: {
                start: moment().add(1, 'month'),
                end: moment()
              }
            }
          ]
        });

        component.options = options;
        expect(() => fixture.detectChanges()).toThrow();
      }));

      it('should throw an error if the range start value is before the options minDate', waitForAsync(() => {
        const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
          minDate: moment().subtract(1, 'month'),
          maxDate: moment(),
          singleCalendar: false,
          preDefinedRanges: [
            {
              name: 'Test Defined Range 1',
              value: {
                start: moment().subtract(2, 'months'),
                end: moment()
              }
            }
          ]
        });

        component.options = options;
        expect(() => fixture.detectChanges()).toThrow();
      }));

      it('should throw an error if the range end value is after the options maxDate', waitForAsync(() => {
        const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
          minDate: moment().subtract(1, 'month'),
          maxDate: moment().add(1, 'day'),
          singleCalendar: false,
          preDefinedRanges: [
            {
              name: 'Test Defined Range 2',
              value: {
                start: moment().subtract(1, 'week'),
                end: moment().add(1, 'month')
              }
            }
          ]
        });

        component.options = options;
        expect(() => fixture.detectChanges()).toThrow();
      }));
    });
  });

  describe('Testing setRange()', () => {
    it('should return the formatted fromDate when using a single calendar', waitForAsync(() => {
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, { singleCalendar: true });
      const now = moment();

      component.options = options;
      component.fromDate = now;

      fixture.detectChanges();

      expect(component.range).toEqual(now.format(options.format));
    }));

    it('should return `fromDate - toDate` when using both calendars', waitForAsync(() => {
      const now = moment();
      const toDate = moment().add(7, 'days');
      const expectedValue = `${ now.format(simpleOptions.format) } - ${ toDate.format(simpleOptions.format) }`;
      const options: IDateRangePickerOptions = Object.assign(simpleOptions, {
        minDate: moment().subtract(1, 'year'),
        maxDate: moment().add(1, 'year'),
        singleCalendar: false,
        preDefinedRanges: null,
      });

      component.options = options;
      component.fromDate = now;
      component.toDate = toDate;

      fixture.detectChanges();

      expect(component.range).toEqual(expectedValue);
    }));

    it('should return an empty string if no fromDate or toDate exists', waitForAsync(() => {
      component.options = simpleOptions;
      component.fromDate = null;
      component.toDate = null;

      fixture.detectChanges();

      expect(component.range).toEqual('');
    }));
  });

  describe('Testing reset', () => {
    it('should clear the inputs as well as the calendar instances when .reset() is called', waitForAsync(() => {
      const now = moment();
      const fromDate = now.subtract(1, 'month');

      component.fromDate = fromDate;
      component.toDate = now;

      fixture.detectChanges();

      const event = new Event('click');
      component.reset(event);

      expect(component.fromDate).toEqual(null);
      expect(component.toDate).toEqual(null);
      expect(component.range).toEqual('');

    }));
  });
});
