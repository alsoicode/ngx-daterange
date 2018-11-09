import * as momentNs from 'moment';

export interface IDateRange {
  start: momentNs.Moment;
  end?: momentNs.Moment;
}
