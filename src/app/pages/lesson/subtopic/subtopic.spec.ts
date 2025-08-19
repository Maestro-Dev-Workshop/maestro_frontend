import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subtopic } from './subtopic';

describe('Subtopic', () => {
  let component: Subtopic;
  let fixture: ComponentFixture<Subtopic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subtopic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subtopic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
