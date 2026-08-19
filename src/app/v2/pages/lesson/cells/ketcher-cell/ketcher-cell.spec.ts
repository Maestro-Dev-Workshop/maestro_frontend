import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KetcherCell } from './ketcher-cell';

describe('KetcherCell', () => {
  let component: KetcherCell;
  let fixture: ComponentFixture<KetcherCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KetcherCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KetcherCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
