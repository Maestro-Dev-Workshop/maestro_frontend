import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { SaveQuestionData } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  constructor(private http: HttpBaseService) {}

  getAllTopics(sessionId: string): Observable<any> {
    return this.http.get<any>(`topic/${sessionId}/list`);
  }

  getAllSubtopics(topicId: string): Observable<any> {
    return this.http.get<any>(`topic/${topicId}/get-content`);
  }

  getExercise(topicId: string): Observable<any> {
    return this.http.get<any>(`topic/${topicId}/get-exercise`);
  }

  getExam(sessionId: string): Observable<any> {
    return this.http.get<any>(`session/${sessionId}/get-exam`);
  }

  markSubtopicAsRead(topicId: string, subtopicId: string): Observable<any> {
    return this.http.put<any>(`topic/${topicId}/mark-as-read`, { subtopic_id: subtopicId });
  }

  scoreEssayQuestion(sessionId: string, questionId: string, answer: string): Observable<any> {
    return this.http.put<any>(`chatbot/answer-question`, { session_id: sessionId, question_id: questionId, answer });
  }

  saveExerciseScore(topicId: string, exerciseId: string, score: number, questionData: SaveQuestionData): Observable<any> {
    return this.http.put<any>(`topic/${topicId}/save-exercise-score`, { exercise_id: exerciseId, score, question_data: questionData });
  }

  saveExamScore(sessionId: string, examId: string, score: number, questionData: SaveQuestionData): Observable<any> {
    return this.http.put<any>(`session/${sessionId}/save-exam-score`, { exam_id: examId, score, question_data: questionData });
  }
}
