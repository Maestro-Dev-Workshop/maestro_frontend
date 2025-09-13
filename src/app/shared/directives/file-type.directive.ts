// src/app/shared/directives/file-type.directive.ts
import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { isAllowedFile } from '../utils/file-validation.util';

@Directive({
  selector: '[appFileType]',
  standalone: true
})
export class FileTypeDirective {
  /** Allowed MIME types, e.g., ['application/pdf','image/png'] */
  @Input() appFileType: string[] = [];
  /** Max size in bytes (default 10MB) */
  @Input() maxBytes = 10 * 1024 * 1024;
  /** Emits file when ok; null when rejected */
  @Output() fileOk = new EventEmitter<File | null>();
  /** Emits error reason when rejected */
  @Output() fileError = new EventEmitter<string>();

  @HostListener('change', ['$event'])
  onChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const f = input.files?.[0];
    if (!f) return;
    const res = isAllowedFile(f, this.appFileType, this.maxBytes);
    if (res.ok) {
      this.fileOk.emit(f);
    } else {
      this.fileError.emit(res.reason || 'Invalid file.');
      this.fileOk.emit(null);
      input.value = ''; // reset selection
    }
  }
}