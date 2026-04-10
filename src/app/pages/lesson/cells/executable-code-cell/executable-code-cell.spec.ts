import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ExecutableCodeCell } from './executable-code-cell';
import { LessonService } from '../../../../core/services/lesson.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ThemeService } from '../../../../core/services/theme.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('ExecutableCodeCell', () => {
  let component: ExecutableCodeCell;
  let fixture: ComponentFixture<ExecutableCodeCell>;
  let mockLessonService: jasmine.SpyObj<LessonService>;
  let mockNotifyService: jasmine.SpyObj<NotificationService>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;

  const mockCodeData = {
    type: 'executable_code',
    content: 'print("Hello, World!")',
    metadata: {
      language: 'Python',
    },
  };

  beforeEach(async () => {
    mockLessonService = jasmine.createSpyObj('LessonService', ['executeCodeBlock']);
    mockNotifyService = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);
    mockThemeService = jasmine.createSpyObj('ThemeService', ['getTheme']);
    mockThemeService.getTheme.and.returnValue('light');

    await TestBed.configureTestingModule({
      imports: [ExecutableCodeCell, FormsModule],
      providers: [
        { provide: LessonService, useValue: mockLessonService },
        { provide: NotificationService, useValue: mockNotifyService },
        { provide: ThemeService, useValue: mockThemeService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutableCodeCell);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.code).toBe('');
      expect(component.language).toBe('');
      expect(component.loading).toBe(false);
      expect(component.output).toEqual({});
    });

    it('should accept data input', () => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.data()).toEqual(mockCodeData);
    });
  });

  describe('Data Processing', () => {
    it('should set code from data content', () => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.code).toBe('print("Hello, World!")');
    });

    it('should set language from metadata (lowercase)', () => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.language).toBe('python');
    });

    it('should calculate height based on line count', () => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      // Single line code = (1 + 1) * 19 = 38px
      expect(component.height).toBe('38px');
    });

    it('should calculate height for multi-line code', () => {
      const multiLineData = {
        ...mockCodeData,
        content: 'line1\nline2\nline3\nline4\nline5',
      };

      fixture.componentRef.setInput('data', multiLineData);
      fixture.detectChanges();

      // 5 lines = (5 + 1) * 19 = 114px
      expect(component.height).toBe('114px');
    });
  });

  describe('Theme Integration', () => {
    it('should set light theme editor options', () => {
      mockThemeService.getTheme.and.returnValue('light');

      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.editorOptions).toEqual(
        jasmine.objectContaining({
          theme: 'vs-light',
        })
      );
    });

    it('should set dark theme editor options', () => {
      mockThemeService.getTheme.and.returnValue('dark');

      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.editorOptions).toEqual(
        jasmine.objectContaining({
          theme: 'vs-dark',
        })
      );
    });

    it('should set automaticLayout in editor options', () => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();

      expect(component.editorOptions).toEqual(
        jasmine.objectContaining({
          automaticLayout: true,
        })
      );
    });
  });

  describe('Code Execution', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();
    });

    it('should execute code successfully', fakeAsync(() => {
      const mockResult = { stdout: 'Hello, World!\n', stderr: '', exit_code: 0 };
      mockLessonService.executeCodeBlock.and.returnValue(of({ result: mockResult }));

      component.runCode();
      tick();

      expect(mockLessonService.executeCodeBlock).toHaveBeenCalledWith(
        'print("Hello, World!")',
        'python'
      );
      expect(component.output).toEqual(mockResult);
    }));

    it('should set loading state during execution', fakeAsync(() => {
      mockLessonService.executeCodeBlock.and.returnValue(of({ result: {} }));

      expect(component.loading).toBe(false);

      component.runCode();
      expect(component.loading).toBe(true);

      tick();
      expect(component.loading).toBe(false);
    }));

    it('should handle execution error', fakeAsync(() => {
      mockLessonService.executeCodeBlock.and.returnValue(
        throwError(() => ({ error: { message: 'Execution failed' } }))
      );

      component.runCode();
      tick();

      expect(mockNotifyService.showError).toHaveBeenCalledWith('Execution failed');
      expect(component.loading).toBe(false);
    }));

    it('should show default error message when none provided', fakeAsync(() => {
      mockLessonService.executeCodeBlock.and.returnValue(
        throwError(() => ({ error: {} }))
      );

      component.runCode();
      tick();

      expect(mockNotifyService.showError).toHaveBeenCalledWith('Code execution failed');
    }));
  });

  describe('Different Languages', () => {
    it('should handle JavaScript', () => {
      const jsData = {
        type: 'executable_code',
        content: 'console.log("Hello");',
        metadata: { language: 'JavaScript' },
      };

      fixture.componentRef.setInput('data', jsData);
      fixture.detectChanges();

      expect(component.language).toBe('javascript');
    });

    it('should handle TypeScript', () => {
      const tsData = {
        type: 'executable_code',
        content: 'const x: number = 5;',
        metadata: { language: 'TypeScript' },
      };

      fixture.componentRef.setInput('data', tsData);
      fixture.detectChanges();

      expect(component.language).toBe('typescript');
    });

    it('should handle Java', () => {
      const javaData = {
        type: 'executable_code',
        content: 'System.out.println("Hello");',
        metadata: { language: 'JAVA' },
      };

      fixture.componentRef.setInput('data', javaData);
      fixture.detectChanges();

      expect(component.language).toBe('java');
    });
  });

  describe('Output Handling', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('data', mockCodeData);
      fixture.detectChanges();
    });

    it('should handle stdout output', fakeAsync(() => {
      const result = { stdout: 'Output text', stderr: '', exit_code: 0 };
      mockLessonService.executeCodeBlock.and.returnValue(of({ result }));

      component.runCode();
      tick();

      expect(component.output.stdout).toBe('Output text');
    }));

    it('should handle stderr output', fakeAsync(() => {
      const result = { stdout: '', stderr: 'Error text', exit_code: 1 };
      mockLessonService.executeCodeBlock.and.returnValue(of({ result }));

      component.runCode();
      tick();

      expect(component.output.stderr).toBe('Error text');
    }));

    it('should clear output on data change', () => {
      component.output = { stdout: 'Previous output' };

      const newData = { ...mockCodeData, content: 'new code' };
      fixture.componentRef.setInput('data', newData);
      fixture.detectChanges();

      expect(component.output).toEqual({});
    });
  });
});
