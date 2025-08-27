import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { timestamp } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  imports: [FormsModule],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.css'
})
export class Chatbot {
  chatHistory = input<any>();
  metadata = input<any>();
  closeChat = output<any>();
  currentMessage: string = ''; 
  loading = false;

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
    this.chatHistory().push({
      sender: "user",
      message: this.currentMessage,
      timestamp: ""
    })

    const reply = {
      userMessage: this.currentMessage,
      metadata: this.metadata()
    }
    this.chatHistory().push({
      sender: "assistant",
      message: JSON.stringify(reply, null, 2),
      timestamp: ""
    })
    console.log(reply)

    this.currentMessage = '';
    this.loading = false;
  }
}
