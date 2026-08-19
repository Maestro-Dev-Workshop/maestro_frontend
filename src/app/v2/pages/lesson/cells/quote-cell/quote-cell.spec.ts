import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCell } from './quote-cell';

describe('QuoteCell', () => {
  let component: QuoteCell;
  let fixture: ComponentFixture<QuoteCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuoteCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuoteCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
