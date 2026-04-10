import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioSnippetCell } from './audio-snippet-cell';

describe('AudioSnippetCell', () => {
  let component: AudioSnippetCell;
  let fixture: ComponentFixture<AudioSnippetCell>;

  const mockAudioData = {
    type: 'audio_snippet',
    content: 'https://example.com/audio/pronunciation.mp3',
    metadata: {
      word: 'hello',
      language: 'en',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioSnippetCell],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioSnippetCell);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty source', () => {
      expect(component.source).toBe('');
    });

    it('should accept data input', () => {
      fixture.componentRef.setInput('data', mockAudioData);
      fixture.detectChanges();

      expect(component.data()).toEqual(mockAudioData);
    });
  });

  describe('Source Update', () => {
    it('should update source when data changes', () => {
      fixture.componentRef.setInput('data', mockAudioData);
      fixture.detectChanges();

      expect(component.source).toBe('https://example.com/audio/pronunciation.mp3');
    });

    it('should update source when data input changes', () => {
      fixture.componentRef.setInput('data', mockAudioData);
      fixture.detectChanges();

      const newAudioData = {
        ...mockAudioData,
        content: 'https://example.com/audio/new-audio.mp3',
      };

      fixture.componentRef.setInput('data', newAudioData);
      fixture.detectChanges();

      expect(component.source).toBe('https://example.com/audio/new-audio.mp3');
    });
  });

  describe('Audio Sources', () => {
    it('should handle mp3 audio source', () => {
      const mp3Data = {
        type: 'audio_snippet',
        content: 'https://example.com/audio.mp3',
        metadata: {},
      };

      fixture.componentRef.setInput('data', mp3Data);
      fixture.detectChanges();

      expect(component.source).toContain('.mp3');
    });

    it('should handle wav audio source', () => {
      const wavData = {
        type: 'audio_snippet',
        content: 'https://example.com/audio.wav',
        metadata: {},
      };

      fixture.componentRef.setInput('data', wavData);
      fixture.detectChanges();

      expect(component.source).toContain('.wav');
    });

    it('should handle data URL audio source', () => {
      const dataUrlData = {
        type: 'audio_snippet',
        content: 'data:audio/mp3;base64,SGVsbG8gV29ybGQ=',
        metadata: {},
      };

      fixture.componentRef.setInput('data', dataUrlData);
      fixture.detectChanges();

      expect(component.source).toContain('data:audio');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty content', () => {
      const emptyData = {
        type: 'audio_snippet',
        content: '',
        metadata: {},
      };

      fixture.componentRef.setInput('data', emptyData);
      fixture.detectChanges();

      expect(component.source).toBe('');
    });

    it('should handle missing metadata', () => {
      const noMetadataData = {
        type: 'audio_snippet',
        content: 'https://example.com/audio.mp3',
      };

      fixture.componentRef.setInput('data', noMetadataData);
      fixture.detectChanges();

      expect(component.source).toBe('https://example.com/audio.mp3');
    });
  });
});
