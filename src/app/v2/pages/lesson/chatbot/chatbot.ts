// chatbot.ts
import {
  Component,
  inject,
  input,
  model,
  output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  effect,
  Injector,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ChatbotService } from '../../../../core/services/chatbot.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { MarkdownPipe } from '../../../../shared/pipes/markdown-pipe';

import { ChatMessage } from '../../../../core/models/chat-message.model';
import { ChatMetadata } from '../../../../core/models/chat-metadata.model';

import { ThemeIconComponent } from "../../../../shared/components/theme-icon/theme-icon";
import { CreditCostSettings } from '../../../../core/models/credit.model';
import { CreditService } from '../../../../core/services/credit.service';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [FormsModule, MarkdownPipe, CommonModule, ThemeIconComponent],
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.css'],
})
export class Chatbot implements OnInit, AfterViewInit, OnDestroy {
  chatHistory = model<ChatMessage[]>([]);
  showLimitWarning = model<boolean>(false);
  subjectId = input.required<string>();
  metadata = input.required<ChatMetadata>();
  closeChat = output<any>();
  triggerReload = output<void>();
  currentMessage: string = '';
  loading = signal(false);
  costSettings = signal<CreditCostSettings | null>(null)

  chatbotService = inject(ChatbotService);
  creditService = inject(CreditService)
  notify = inject(NotificationService);
  private injector = inject(Injector);
  private viewReady = false;
  private autoScrollEffect = effect(
    () => {
      const history = this.chatHistory();
      if (!this.viewReady || history.length === 0) return;
      queueMicrotask(() => this.scrollToBottom());
    },
    { injector: this.injector }
  );

  @ViewChild('chatContainer')
  private chatContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput')
  private messageInput!: ElementRef<HTMLTextAreaElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // initial scroll attempt
    this.scrollToBottom();

    this.creditService.getCostSettings().subscribe({
      next: (response) => {
        this.costSettings.set(response.settings);
      },
      error: (res) => {
        this.notify.showError(
          res?.error?.message ||
            'Failed to fetch credit cost settings. Please try again.'
        );
      },
    });
  }

  ngAfterViewInit() {
    this.viewReady = true;
    queueMicrotask(() => this.scrollToBottom());
  }

  ngOnDestroy() {
    // cleanup if needed
  }

  onCloseChat() {
    this.closeChat.emit({});
  }

  trackByIndex(index: number) {
    return index;
  }

  private scrollToBottom() {
    const el = this.chatContainer?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  adjustInputHeight() {
    const ta = this.messageInput?.nativeElement;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = 160; // px
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
  }

  sendMessage() {
    const text = (this.currentMessage || '').trim();
    if (!text) return;

    // push user message immediately for snappy UI
    const userMsg: ChatMessage = {
      sender: 'user',
      message: text,
      timestamp: new Date().toLocaleTimeString(),
    };
    // update signal
    this.chatHistory.update((h) => [...h, userMsg]);

    // reset composer
    this.currentMessage = '';
    this.adjustInputHeight();
    this.loading.set(true);

    // call backend
    this.chatbotService
      .sendMessage(this.subjectId(), text, this.metadata())
      .subscribe({
        next: (response) => {
          this.showLimitWarning.set(response.limit_warning || false);
          const assistantMsg: ChatMessage = {
            sender: 'assistant',
            message: response.response,
            timestamp: new Date().toLocaleTimeString(),
          };
          this.chatHistory.update((h) => [...h, assistantMsg]);
          this.loading.set(false);
          if (response.limit_warning) {
            this.triggerReload.emit();
          }
        },
        error: (res) => {
          this.loading.set(false)
          this.notify.showError(
            res?.error?.message ||
              'Failed to send message. Please try again.'
          );
        },
      });

    // ensure scroll after pushing user message
    queueMicrotask(() => this.scrollToBottom());
  }

  handleKeyDown(event: KeyboardEvent) {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) return; // allow newlines on mobile

    if (event.key === 'Enter') {
      if (event.shiftKey || event.ctrlKey) {
        // insert newline
        const ta = this.messageInput?.nativeElement;
        if (!ta) return;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const before = this.currentMessage.slice(0, start);
        const after = this.currentMessage.slice(end);
        this.currentMessage = before + '\n' + after;
        queueMicrotask(() => {
          ta.selectionStart = ta.selectionEnd = start + 1;
          this.adjustInputHeight();
        });
        event.preventDefault();
        this.cdr.detectChanges();
      } else {
        event.preventDefault();
        this.sendMessage();
      }
    }
  }

  // small helper to insert example prompts
  insertExample(text: string) {
    this.currentMessage = text;
    queueMicrotask(() => {
      this.messageInput?.nativeElement.focus();
      this.adjustInputHeight();
      this.cdr.detectChanges();
    });
  }
}
