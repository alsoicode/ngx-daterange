import * as moment from 'moment';

import { IDefinedDateRange } from './IDefinedDateRange';
import { ITimePickerOptions } from './ITimePickerOptions';

export interface IDateRangePickerOptions {
  startDate: moment.Moment;
  endDate: moment.Moment;
  minDate: moment.Moment;
  maxDate: moment.Moment;
  format: string;
  displayFormat: string;
  inactiveBeforeStart: boolean;
  autoApply: boolean;
  singleCalendar: boolean;
  preDefinedRanges?: IDefinedDateRange[];
  noDefaultRangeSelected: boolean;
  position: string;
  disabled: boolean;
  timePicker?: ITimePickerOptions;
  disableBeforeStart: boolean;
  alwaysOpen: boolean;
}
