import { ValidatorFn } from '@angular/forms';
import * as momentNs from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';
import { ITimePickerOptions } from './ITimePickerOptions';

export interface IDateRangePickerOptions {
  startDate: momentNs.Moment;
  endDate: momentNs.Moment;
  minDate: momentNs.Moment;
  maxDate: momentNs.Moment;
  format: string;
  displayFormat: string;
  inactiveBeforeStart: boolean;
  autoApply: boolean;
  singleCalendar: boolean;
  preDefinedRanges?: IDefinedDateRange[];
  noDefaultRangeSelected: boolean;
  position: string;
  disabled: boolean;
  timePickerOptions?: ITimePickerOptions;
  disableBeforeStart: boolean;
  alwaysOpen: boolean;
  validators?: ValidatorFn | ValidatorFn[];
  icons: 'default' | 'material';
}
