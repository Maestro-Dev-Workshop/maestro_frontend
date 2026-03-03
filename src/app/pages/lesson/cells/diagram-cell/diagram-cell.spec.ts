import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramCell } from './diagram-cell';

describe('DiagramCell', () => {
  let component: DiagramCell;
  let fixture: ComponentFixture<DiagramCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiagramCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiagramCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
