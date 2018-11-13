import { NgZone } from '@angular/core';

export class MockNgZone extends NgZone {

  run(fn: Function): any {
    return fn();
  }

}
