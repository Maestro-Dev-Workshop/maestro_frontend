import { Component, inject, input, model, output, AfterViewInit, ElementRef, ViewChild, effect, Injector, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timestamp } from 'rxjs';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { ChatMetadata } from '../../../core/models/chat-metadata.model';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot implements OnInit {
  chatHistory = model<ChatMessage[]>([]);
  subjectId = input<string>()
  metadata = input<ChatMetadata>();
  closeChat = output<any>();
  currentMessage: string = ''; 
  loading = false;
  chatbotService = inject(ChatbotService)
  notify = inject(NotificationService);
  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLDivElement>;

  constructor(private cdr: ChangeDetectorRef) {}

  onCloseChat() {
    this.closeChat.emit({});
  }

  private injector = inject(Injector);
  private viewReady = false;

  // Create the effect in an injection context
  private autoScrollEffect = effect(
    () => {
      const history = this.chatHistory(); // track changes
      // don’t try to scroll before the view exists
      if (!this.viewReady || history.length === 0) return;

      // defer until DOM has rendered the new item
      queueMicrotask(() => this.scrollToBottom());
    },
    { injector: this.injector }
  );

  ngAfterViewInit() {
    this.viewReady = true;
    // initial scroll (e.g., when history is preloaded)
    queueMicrotask(() => this.scrollToBottom());
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const el = this.chatContainer?.nativeElement;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  sendMessage() {
    this.loading = true;
    if (!this.currentMessage) {
      this.loading = false;
      return
    }

    this.chatHistory()?.push({
      sender: "user",
      message: this.currentMessage,
      timestamp: Date().toLocaleString(),
    })

    this.chatbotService.sendMessage(this.subjectId(), this.currentMessage, this.metadata()).subscribe({
      next: (response) => {
        this.chatHistory.update(history => [
          ...history,
          {
            sender: "assistant",
            message: response.response,
            timestamp: new Date().toLocaleString(),
          }
        ]);
        this.currentMessage = '';
        this.loading = false;
        this.cdr.detectChanges();
      }, error: (res) => {
        this.loading = false;
        this.notify.showError(res.error.message || 'Failed to send message. Please try again.');
        this.cdr.detectChanges();
      },
    });
  }

  handleKeyDown(event: KeyboardEvent) {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  
    if (isMobile) return; // always allow newlines on mobile
  
    if (event.key === 'Enter') {
      if (event.shiftKey || event.ctrlKey) {
        // insert newline manually
        const textarea = event.target as HTMLTextAreaElement;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        this.currentMessage = this.currentMessage.slice(0, start) + '\n' + this.currentMessage.slice(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
        event.preventDefault();
        this.cdr.detectChanges();
      } else {
        // send message
        event.preventDefault();
        this.sendMessage();
      }
    }
  }
}
