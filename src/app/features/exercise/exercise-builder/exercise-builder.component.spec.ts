import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciseBuilderComponent } from './exercise-builder.component';

describe('ExerciseBuilderComponent', () => {
  let component: ExerciseBuilderComponent;
  let fixture: ComponentFixture<ExerciseBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExerciseBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciseBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
