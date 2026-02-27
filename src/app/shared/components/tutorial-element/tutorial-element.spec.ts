import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialElement } from './tutorial-element';

describe('TutorialElement', () => {
  let component: TutorialElement;
  let fixture: ComponentFixture<TutorialElement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TutorialElement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TutorialElement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
