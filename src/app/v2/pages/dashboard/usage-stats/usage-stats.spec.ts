import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsageStats } from './usage-stats';

describe('UsageStats', () => {
  let component: UsageStats;
  let fixture: ComponentFixture<UsageStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsageStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsageStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
