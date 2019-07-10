import { ValidatorFn } from '@angular/forms';
import * as momentNs from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';

export interface IDateRangePickerOptions {
  autoApply?: boolean;
  clickOutsideAllowed?: boolean;
  displayFormat?: string;
  disabled?: boolean;
  format: string;
  icons?: 'default' | 'material' | 'font-awesome';
  labelText?: string;
  minDate: momentNs.Moment;
  maxDate: momentNs.Moment;
  position?: 'left' | 'right';
  preDefinedRanges?: IDefinedDateRange[];
  singleCalendar?: boolean;
  startingFromDate?: momentNs.Moment;
  startingToDate?: momentNs.Moment;
  validators?: ValidatorFn | ValidatorFn[];
}
