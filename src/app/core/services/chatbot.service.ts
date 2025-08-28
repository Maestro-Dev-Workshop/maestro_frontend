import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { ChatMetadata } from '../models/chat-metadata.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  constructor(private http: HttpBaseService) {}

  sendMessage(sessionId: string, message: string, metadata: ChatMetadata): Observable<any> {
    return this.http.post(`chatbot/${sessionId}/send-message`, { message, metadata });
  }

  getChatHistory(sessionId: string): Observable<any> {
    return this.http.get(`chatbot/${sessionId}/chat-history`);
  }
}