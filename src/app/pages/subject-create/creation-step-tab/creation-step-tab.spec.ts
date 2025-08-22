import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationStepTab } from './creation-step-tab';

describe('CreationStepTab', () => {
  let component: CreationStepTab;
  let fixture: ComponentFixture<CreationStepTab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationStepTab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreationStepTab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
