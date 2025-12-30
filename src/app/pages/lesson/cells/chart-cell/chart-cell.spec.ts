import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCell } from './chart-cell';

describe('ChartCell', () => {
  let component: ChartCell;
  let fixture: ComponentFixture<ChartCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
