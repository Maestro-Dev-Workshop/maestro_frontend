import { ChangeDetectorRef, Component, effect, inject, input, signal } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG, MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme.service';
import { LessonService } from '../../../../core/services/lesson.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { CodeExecutionOutput } from '../../../../core/models/code-execution.model';
import { ThemeIconComponent } from '../../../../shared/components/theme-icon/theme-icon';

/** Input data structure for executable code cell */
interface CodeCellData {
  content: string;
  metadata: {
    language: string;
  };
}

/** Monaco editor options */
interface MonacoEditorOptions {
  theme: string;
  language: string;
  automaticLayout: boolean;
}

@Component({
  selector: 'app-executable-code-cell',
  imports: [MonacoEditorModule, FormsModule, ThemeIconComponent],
  providers: [
    {
      provide: NGX_MONACO_EDITOR_CONFIG,
      useValue: { baseUrl: 'assets/monaco/vs' }
    }
  ],
  templateUrl: './executable-code-cell.html',
  styleUrl: './executable-code-cell.css',
})
export class ExecutableCodeCell {
  data = input<CodeCellData>();
  editorOptions: MonacoEditorOptions = { theme: 'vs-dark', language: '', automaticLayout: true };
  code = '';
  language = '';
  height = '';
  output: CodeExecutionOutput = {};
  loading = signal<boolean>(false);
  themeService = inject(ThemeService);
  lessonService = inject(LessonService);
  notify = inject(NotificationService);

  constructor(private cdr: ChangeDetectorRef) {}

  private updateOnInputChange = effect(() => {
    const cellData = this.data();
    if (!cellData) return;

    this.output = {};
    this.loading.set(false);
    this.language = cellData.metadata.language.toLowerCase();
    this.editorOptions = {
      theme: (this.themeService.getTheme() === 'light') ? 'vs-light' : 'vs-dark',
      language: this.language,
      automaticLayout: true,
    };
    this.code = cellData.content;
    const lineCount = this.code.split('\n').length;
    this.height = `${(lineCount + 1) * 19}px`;
  });

  runCode() {
    this.loading.set(true);

    this.lessonService.executeCodeBlock(this.code, this.language).subscribe({
      next: (response) => {
        this.output = response.result as CodeExecutionOutput;
        this.loading.set(false);
      },
      error: (res) => {
        this.notify.showError(res.error?.message || "Code execution failed");
        this.loading.set(false);
      },
    });
  }

  copyCode() {
    navigator.clipboard.writeText(this.code)
      .then(() => this.notify.showSuccess("Code copied to clipboard"))
      .catch(err => console.error('Copy failed:', err));
  }
}
