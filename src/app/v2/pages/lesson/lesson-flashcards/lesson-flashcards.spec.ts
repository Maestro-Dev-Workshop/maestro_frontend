import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonFlashcards } from './lesson-flashcards';

describe('LessonFlashcards', () => {
  let component: LessonFlashcards;
  let fixture: ComponentFixture<LessonFlashcards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonFlashcards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonFlashcards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
