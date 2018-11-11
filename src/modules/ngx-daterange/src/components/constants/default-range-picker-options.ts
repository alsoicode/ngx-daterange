import { IDateRangePickerOptions } from '../../interfaces';

import { defaultDateFormat } from '../constants/default-formats';

export const defaultDateRangePickerOptions: IDateRangePickerOptions = {
  startDate: null,
  endDate: null,
  minDate: null,
  maxDate: null,
  format: defaultDateFormat,
  displayFormat: defaultDateFormat,
  autoApply: false,
  singleCalendar: false,
  preDefinedRanges: [],
  position: 'left',
  disabled: false,
  timePickerOptions: null,
  alwaysOpen: false,
  icons: 'default',
  labelText: 'Date Range',
};
