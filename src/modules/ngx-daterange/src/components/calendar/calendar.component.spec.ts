import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import * as moment from 'moment';

import { CalendarComponent } from '../calendar/calendar.component';
import { FormatMomentDatePipe } from '../../pipes/format-moment-date.pipe';


describe('Testing CalendarComponent', () => {

  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CalendarComponent,
        FormatMomentDatePipe,
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    })
    .compileComponents()
    .then(() => {
      fixture = TestBed.createComponent(CalendarComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    fixture.destroy();
    component = null;
  });

  it('The Calendar Component should initialize', async(() => {
    fixture.detectChanges();

    expect(component).toBeDefined();
  }));
});
