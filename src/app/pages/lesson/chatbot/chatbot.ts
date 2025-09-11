import { Component, inject, input, model, output, AfterViewInit, ElementRef, ViewChild, effect, Injector } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timestamp } from 'rxjs';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { ChatMetadata } from '../../../core/models/chat-metadata.model';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {
  chatHistory = model<ChatMessage[]>([]);
  subjectId = input<string>()
  metadata = input<ChatMetadata>();
  closeChat = output<any>();
  currentMessage: string = ''; 
  loading = false;
  chatbotService = inject(ChatbotService)
  @ViewChild('chatContainer') private chatContainer!: ElementRef<HTMLDivElement>;

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

    console.log(this.currentMessage);
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
        console.log(response);
      }, error: (err) => {
        console.error(`Error sending message: ${err}`);
        this.loading = false;
      },
    });
    
  }
}
