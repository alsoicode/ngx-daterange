import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PredefinedDateRangesComponent } from './predefined-date-ranges.component';

describe('PredefinedDateRangesComponent', () => {
  let component: PredefinedDateRangesComponent;
  let fixture: ComponentFixture<PredefinedDateRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PredefinedDateRangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PredefinedDateRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
