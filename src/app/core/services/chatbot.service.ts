import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { ChatMetadata } from '../models/chat-metadata.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  http = inject(HttpBaseService);

  sendMessage(subjectId?: string, message?: string, metadata?: ChatMetadata): Observable<any> {
    return this.http.post(`chatbot/${subjectId}/messages`, { message, metadata });
  }

  getChatHistory(subjectId?: string): Observable<any> {
    return this.http.get(`chatbot/${subjectId}/history`);
  }
}
