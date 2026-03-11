import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { ChatMetadata } from '../models/chat-metadata.model';
import { ChatHistoryResponse, ChatMessageResponse } from '../models/api-response.model';

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpBaseService);

  sendMessage(
    subjectId: string,
    message: string,
    metadata: ChatMetadata
  ): Observable<ChatMessageResponse> {
    return this.http.post<ChatMessageResponse>(`chatbot/${subjectId}/messages`, {
      message,
      metadata,
    });
  }

  getChatHistory(subjectId: string): Observable<ChatHistoryResponse> {
    return this.http.get<ChatHistoryResponse>(`chatbot/${subjectId}/history`);
  }
}
