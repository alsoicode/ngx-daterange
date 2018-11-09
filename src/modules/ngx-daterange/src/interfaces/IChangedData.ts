import * as momentNs from 'moment';

export interface IChangedData {
  isLeft?: boolean;
  day?: momentNs.Moment;
  value?: number;
}
