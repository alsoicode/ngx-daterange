import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDateRangePickerOptions, IDefinedDateRange } from '../../interfaces';

@Component({
  selector: 'predefined-date-ranges',
  templateUrl: './predefined-date-ranges.component.html',
  styleUrls: ['./predefined-date-ranges.component.scss']
})
export class PredefinedDateRangesComponent implements OnInit {

  @Input()
  options: IDateRangePickerOptions;

  @Input()
  range: string;

  @Input()
  enableApplyButton: boolean;

  @Output()
  closeEvent = new EventEmitter<Event>();

  @Output()
  resetEvent = new EventEmitter<Event>();

  @Output()
  applyEvent = new EventEmitter<Event>();

  @Output()
  predefinedRange = new EventEmitter<{ event: Event, definedDateRange: IDefinedDateRange }>();

  constructor() { }

  ngOnInit(): void {
  }


  applyPredefinedRange(event: Event, definedDateRange: IDefinedDateRange): void {
    this.predefinedRange.emit({ event: event, definedDateRange: definedDateRange });
  }

  close(event: Event): void {
    this.closeEvent.emit(event);

    event.stopPropagation();
  }

  reset(event: Event): void {
    this.resetEvent.emit(event);

    event.stopPropagation();
  }

  apply(event: Event): void {
    this.applyEvent.emit(event);

    event.stopPropagation();
  }

}
