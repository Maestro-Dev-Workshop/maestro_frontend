import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { SaveQuestionData } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  http = inject(HttpBaseService);

  getAllTopics(subjectId: string): Observable<any> {
    return this.http.get<any>(`subjects/${subjectId}/topics`);
  }

  getAllSubtopics(topicId: string): Observable<any> {
    return this.http.get<any>(`topics/${topicId}`);
  }

  getExercise(topicId: string): Observable<any> {
    return this.http.get<any>(`topics/${topicId}/exercise`);
  }

  getExam(subjectId: string): Observable<any> {
    return this.http.get<any>(`subjects/${subjectId}/exam`);
  }

  scoreEssayQuestion(subjectId?: string, questionId?: string, answer?: string | null): Observable<any> {
    return this.http.post<any>(`chatbot/questions/evaluate`, { session_id: subjectId, question_id: questionId, answer });
  }

  markSubtopicAsRead(topicId: string, subtopicId: string): Observable<any> {
    return this.http.put<any>(`topics/${topicId}/read`, { subtopic_id: subtopicId });
  }

  saveExerciseScore(topicId?: string | null, exerciseId?: string, score?: number, questionData?: SaveQuestionData[]): Observable<any> {
    return this.http.put<any>(`topics/${topicId}/exercise/score`, { exercise_id: exerciseId, score, question_data: questionData });
  }

  saveExamScore(subjectId?: string, examId?: string, score?: number, questionData?: SaveQuestionData[]): Observable<any> {
    return this.http.put<any>(`subjects/${subjectId}/exam/score`, { exam_id: examId, score, question_data: questionData });
  }

  getGlossary(subjectId: string): Observable<any> {
    return this.http.get<any>(`subjects/${subjectId}/glossary`);
  }

  getFlashcards(topicId: string): Observable<any> {
    return this.http.get<any>(`topics/${topicId}/flashcards`);
  }

  executeCodeBlock(code: string, language: string): Observable<any> {
    return this.http.post<any>(`topics/code/execute`, { code, language })
  }
}
