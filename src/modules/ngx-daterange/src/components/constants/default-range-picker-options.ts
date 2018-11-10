import { IDateRangePickerOptions } from '../../interfaces';

import { defaultDateFormat } from '../constants/default-formats';

export const defaultDateRangePickerOptions: IDateRangePickerOptions = {
  startDate: null,
  endDate: null,
  minDate: null,
  maxDate: null,
  format: defaultDateFormat,
  displayFormat: defaultDateFormat,
  inactiveBeforeStart: false,
  autoApply: false,
  singleCalendar: false,
  preDefinedRanges: [],
  noDefaultRangeSelected: false,
  position: 'left',
  disabled: false,
  timePickerOptions: null,
  disableBeforeStart: false,
  alwaysOpen: false,
  icons: 'default',
};
