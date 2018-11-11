import { ValidatorFn } from '@angular/forms';
import * as momentNs from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';
import { ITimePickerOptions } from './ITimePickerOptions';

export interface IDateRangePickerOptions {
  alwaysOpen: boolean;
  autoApply: boolean;
  displayFormat: string;
  disabled: boolean;
  endDate: momentNs.Moment;
  format: string;
  icons: 'default' | 'material' | 'font-awesome';
  labelText?: string;
  minDate: momentNs.Moment;
  maxDate: momentNs.Moment;
  noDefaultRangeSelected: boolean;
  position: 'left' | 'right' | 'center';
  preDefinedRanges?: IDefinedDateRange[];
  singleCalendar: boolean;
  startDate: momentNs.Moment;
  timePickerOptions?: ITimePickerOptions;
  validators?: ValidatorFn | ValidatorFn[];
}
