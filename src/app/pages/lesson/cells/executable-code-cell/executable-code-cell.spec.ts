import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutableCodeCell } from './executable-code-cell';

describe('ExecutableCodeCell', () => {
  let component: ExecutableCodeCell;
  let fixture: ComponentFixture<ExecutableCodeCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutableCodeCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExecutableCodeCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
