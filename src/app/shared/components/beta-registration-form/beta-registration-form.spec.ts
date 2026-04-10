import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetaRegistrationForm } from './beta-registration-form';

describe('BetaRegistrationForm', () => {
  let component: BetaRegistrationForm;
  let fixture: ComponentFixture<BetaRegistrationForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BetaRegistrationForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetaRegistrationForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
