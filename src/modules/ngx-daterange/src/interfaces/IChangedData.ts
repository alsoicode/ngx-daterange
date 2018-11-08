import * as moment from 'moment';

export interface IChangedData {
  isLeft: boolean;
  day?: moment.Moment;
  value?: number;
}
