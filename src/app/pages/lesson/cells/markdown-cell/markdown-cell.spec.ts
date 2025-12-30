import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownCell } from './markdown-cell';

describe('MarkdownCell', () => {
  let component: MarkdownCell;
  let fixture: ComponentFixture<MarkdownCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarkdownCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkdownCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
