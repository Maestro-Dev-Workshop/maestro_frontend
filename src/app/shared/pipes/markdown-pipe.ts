import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import MarkdownIt from 'markdown-it';
import markdownItKatex from 'markdown-it-katex';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  private md = new MarkdownIt({ html: true, linkify: true, typographer: true })
    .use(markdownItKatex);

  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | null | undefined): SafeHtml {
    if (!value) return '';
    const html = this.md.render(value);
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
