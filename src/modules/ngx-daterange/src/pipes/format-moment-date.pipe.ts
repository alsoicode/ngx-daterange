import { Pipe, PipeTransform } from '@angular/core';
import * as momentNs from 'moment';

@Pipe({
  name: 'formatMomentDate'
})
export class FormatMomentDatePipe implements PipeTransform {
  transform(value: momentNs.Moment, format: string): string {
    return value ? value.format(format) : '';
  }
}
