import { DateRangePickerComponent } from './date-range-picker.component';
import { defaultDateRangePickerOptions } from '../constants';

describe('Testing DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;

  beforeEach(() => {
    component = new DateRangePickerComponent();
  });

  it('should instantiate with default options if none are provided', () => {
    expect(component).not.toBe(null);

    Object.keys(defaultDateRangePickerOptions).forEach((key: string) => {
      expect(component.options[key]).toEqual(defaultDateRangePickerOptions[key]);
    });
  });
});
