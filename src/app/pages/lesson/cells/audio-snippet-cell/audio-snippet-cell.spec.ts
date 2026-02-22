import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioSnippetCell } from './audio-snippet-cell';

describe('AudioSnippetCell', () => {
  let component: AudioSnippetCell;
  let fixture: ComponentFixture<AudioSnippetCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioSnippetCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioSnippetCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
