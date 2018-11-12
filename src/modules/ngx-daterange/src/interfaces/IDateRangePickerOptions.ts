import { ValidatorFn } from '@angular/forms';
import * as momentNs from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';
import { ITimePickerOptions } from './ITimePickerOptions';

export interface IDateRangePickerOptions {
  autoApply?: boolean;
  displayFormat?: string;
  disabled?: boolean;
  format: string;
  icons: 'default' | 'material' | 'font-awesome';
  labelText?: string;
  minDate: momentNs.Moment;
  maxDate: momentNs.Moment;
  position?: 'left' | 'right';
  preDefinedRanges?: IDefinedDateRange[];
  singleCalendar?: boolean;
  timePickerOptions?: ITimePickerOptions;
  validators?: ValidatorFn | ValidatorFn[];
}
