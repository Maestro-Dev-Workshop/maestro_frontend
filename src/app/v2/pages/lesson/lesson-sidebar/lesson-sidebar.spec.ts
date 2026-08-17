import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonSidebar } from './lesson-sidebar';

describe('LessonSidebar', () => {
  let component: LessonSidebar;
  let fixture: ComponentFixture<LessonSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LessonSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
