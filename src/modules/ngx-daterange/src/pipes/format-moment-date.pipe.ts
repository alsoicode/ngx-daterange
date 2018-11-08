import { Pipe, PipeTransform } from '@angular/core';
import * as moment_ from 'moment';

const moment = moment_;

@Pipe({
  name: 'formatMomentDate'
})
export class FormatMomentDatePipe implements PipeTransform {
  transform(value: moment_.Moment, format: string): string {
    return value ? value.format(format) : '';
  }
}
