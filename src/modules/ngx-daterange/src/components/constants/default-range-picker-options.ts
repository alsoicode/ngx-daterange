import { IDateRangePickerOptions } from '../../interfaces';

import { defaultDateFormat } from '../constants/default-formats';

export const defaultDateRangePickerOptions: IDateRangePickerOptions = {
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
  icons: 'default',
  labelText: 'Date Range',
};
