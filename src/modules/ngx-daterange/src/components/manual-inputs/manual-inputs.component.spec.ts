import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualInputsComponent } from './manual-inputs.component';

describe('ManualInputsComponent', () => {
  let component: ManualInputsComponent;
  let fixture: ComponentFixture<ManualInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualInputsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
