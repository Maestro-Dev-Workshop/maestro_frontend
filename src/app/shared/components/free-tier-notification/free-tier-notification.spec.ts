import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeTierNotification } from './free-tier-notification';

describe('FreeTierNotification', () => {
  let component: FreeTierNotification;
  let fixture: ComponentFixture<FreeTierNotification>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FreeTierNotification]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FreeTierNotification);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
