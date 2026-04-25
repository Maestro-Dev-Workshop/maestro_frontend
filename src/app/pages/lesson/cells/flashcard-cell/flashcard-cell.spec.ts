import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardCell } from './flashcard-cell';

describe('FlashcardCell', () => {
  let component: FlashcardCell;
  let fixture: ComponentFixture<FlashcardCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
