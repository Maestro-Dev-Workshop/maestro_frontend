import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonGeneration } from './lesson-generation';

describe('LessonGeneration', () => {
  let component: LessonGeneration;
  let fixture: ComponentFixture<LessonGeneration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonGeneration]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonGeneration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
