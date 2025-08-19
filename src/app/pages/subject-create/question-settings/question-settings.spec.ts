import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionSettings } from './question-settings';

describe('QuestionSettings', () => {
  let component: QuestionSettings;
  let fixture: ComponentFixture<QuestionSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
