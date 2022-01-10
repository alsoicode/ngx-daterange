import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IDateRangePickerOptions } from '../../interfaces';

import * as momentNs from 'moment'; const moment = momentNs;

@Component({
  selector: 'manual-inputs',
  templateUrl: './manual-inputs.component.html',
  styleUrls: ['./manual-inputs.component.scss']
})
export class ManualInputsComponent implements OnInit {

  @Input()
  options: IDateRangePickerOptions;

  @Input()
  fromDate: momentNs.Moment = null;

  @Input()
  toDate: momentNs.Moment = null;

  @Input()
  isMobile: boolean;

  @Output()
  dateFromInput = new EventEmitter<{ event: Event, isLeft: boolean}>();

  constructor() { }

  ngOnInit(): void {
  }

  setDateFromInput(event: Event, isLeft: boolean = false): void {
    this.dateFromInput.emit({event, isLeft});
  }

}
