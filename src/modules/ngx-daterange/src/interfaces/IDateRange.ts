import * as moment from 'moment';

export interface IDateRange {
  start: moment.Moment;
  end?: moment.Moment;
}
