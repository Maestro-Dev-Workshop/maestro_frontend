import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPayment } from './verify-payment';

describe('VerifyPayment', () => {
  let component: VerifyPayment;
  let fixture: ComponentFixture<VerifyPayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPayment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifyPayment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
