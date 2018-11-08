import * as moment_ from 'moment';
const moment = moment_;

import { IDefaultDateRanges } from '../../interfaces';

const m = moment();

export const defaultDateRanges: IDefaultDateRanges = {
  ranges: [
    {
      name: 'Today',
      value: {
        start: m,
        end: m
      }
    },
    {
      name: 'Yesterday',
      value: {
        start: m.subtract(1, 'days'),
        end: m.subtract(1, 'days')
      }
    },
    {
      name: 'last 7 days',
      value: {
        start: m.subtract(6, 'days'),
        end: m
      }
    },
    {
      name: 'This month',
      value: {
        start: m.startOf('month'),
        end: m.endOf('month')
      }
    },
    {
      name: 'Last Month',
      value: {
        start: m.subtract(1, 'month').startOf('month'),
        end: m.subtract(1, 'month').endOf('month')
      }
    }
  ]
};
