import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { NGX_MONACO_EDITOR_CONFIG, MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../../core/services/theme.service';
import { LessonService } from '../../../../core/services/lesson.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-executable-code-cell',
  imports: [MonacoEditorModule, FormsModule],
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
  data = input<any>();
  editorOptions = {}
  code = ''
  language = ''
  height = ''
  output: any = {}
  loading = false
  themeService = inject(ThemeService)
  lessonService = inject(LessonService)
  notify = inject(NotificationService)

  constructor (private cdr: ChangeDetectorRef) {}

  private updateOnInputChange = effect(() => {
    this.output = {}
    this.loading = false
    this.language = this.data().metadata.language.toLowerCase()
    this.editorOptions = {
      theme: (this.themeService.getTheme() == 'light') ? 'vs-light' : 'vs-dark',
      language: this.language,
      automaticLayout: true,
    }
    this.code = this.data().content
    const lineCount = this.code.split('\n').length
    this.height = `${(lineCount + 1) * 19}px`
  });

  runCode() {
    this.loading = true
    this.cdr.detectChanges();

    this.lessonService.executeCodeBlock(this.code, this.language).subscribe({
      next: (response) => {
        this.output = response.result;
        // console.log(this.output)
        this.loading = false
        this.cdr.detectChanges()
      }, error: (res) => {
        this.notify.showError(res.error.message || "Code execution failed")
        this.loading = false
        this.cdr.detectChanges()
      },
    })
  }
}
