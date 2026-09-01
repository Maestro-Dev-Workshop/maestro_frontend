import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardBtn } from './standard-btn';

describe('StandardBtn', () => {
  let component: StandardBtn;
  let fixture: ComponentFixture<StandardBtn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardBtn]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardBtn);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
