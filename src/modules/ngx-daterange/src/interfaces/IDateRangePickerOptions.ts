import { ValidatorFn } from '@angular/forms';
import * as momentNs from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';
import { ITimePickerOptions } from './ITimePickerOptions';

export interface IDateRangePickerOptions {
  alwaysOpen: boolean;
  autoApply: boolean;
  displayFormat: string;
  disabled: boolean;
  disableBeforeStart: boolean;
  endDate: momentNs.Moment;
  format: string;
  icons: 'default' | 'material' | 'font-awesome';
  // inactiveBeforeStart: boolean;
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
