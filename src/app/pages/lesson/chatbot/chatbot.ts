import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timestamp } from 'rxjs';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { ChatMetadata } from '../../../core/models/chat-metadata.model';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule, MarkdownModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {
  chatHistory = input<ChatMessage[]>();
  subjectId = input<string>()
  metadata = input<ChatMetadata>();
  closeChat = output<any>();
  currentMessage: string = ''; 
  loading = false;
  chatbotService = inject(ChatbotService)

  onCloseChat() {
    this.closeChat.emit({});
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
        this.chatHistory()?.push({
          sender: "assistant",
          message: JSON.stringify(response.reply, null, 2),
          timestamp: Date().toLocaleString(),
        })
        console.log(response.reply)
    
        this.currentMessage = '';
        this.loading = false;
      }, error: (err) => {
        console.error(`Error sending message: ${err}`);
        this.loading = false;
      },
    });
    
  }
}
