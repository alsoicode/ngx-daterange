import { Pipe, PipeTransform } from '@angular/core';
import * as momentNs from 'moment';
const moment = momentNs;

@Pipe({
  name: 'formatMomentDate'
})
export class FormatMomentDatePipe implements PipeTransform {
  transform(value: momentNs.Moment, format: string): string {
    let valueToFormat = value;

    if (valueToFormat && !momentNs.isMoment(valueToFormat)) {
      valueToFormat = moment(valueToFormat);
    }

    return valueToFormat ? valueToFormat.format(format) : '';
  }
}
