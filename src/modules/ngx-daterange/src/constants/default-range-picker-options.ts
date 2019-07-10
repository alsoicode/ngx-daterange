import { IDateRangePickerOptions } from '../interfaces';

import { defaultDateFormat } from '../constants/default-formats';

export const defaultDateRangePickerOptions: IDateRangePickerOptions = {
  autoApply: true,
  clickOutsideAllowed: true,
  disabled: false,
  icons: 'default',
  format: defaultDateFormat,
  labelText: 'Date Range',
  maxDate: null,
  minDate: null,
  position: 'left',
  preDefinedRanges: [],
  singleCalendar: false,
};
