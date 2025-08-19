import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicPreferences } from './topic-preferences';

describe('TopicPreferences', () => {
  let component: TopicPreferences;
  let fixture: ComponentFixture<TopicPreferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicPreferences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicPreferences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
