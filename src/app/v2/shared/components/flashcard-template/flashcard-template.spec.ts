import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardTemplate } from './flashcard-template';

describe('FlashcardTemplate', () => {
  let component: FlashcardTemplate;
  let fixture: ComponentFixture<FlashcardTemplate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlashcardTemplate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardTemplate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
