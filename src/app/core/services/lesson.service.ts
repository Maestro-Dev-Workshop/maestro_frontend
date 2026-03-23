import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpBaseService } from './http-base.service';
import { SaveQuestionData } from '../models/question.model';
import {
  TopicListResponse,
  TopicContentResponse,
  ExerciseResponse,
  ExamResponse,
  MarkAsReadResponse,
  SaveExerciseScoreResponse,
  SaveExamScoreResponse,
  GlossaryResponse,
  FlashcardResponse,
  CodeExecutionResponse,
  EssayEvaluationResponse,
} from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private http = inject(HttpBaseService);

  getAllTopics(subjectId: string): Observable<TopicListResponse> {
    return this.http.get<TopicListResponse>(`subjects/${subjectId}/topics`);
  }

  getAllSubtopics(topicId: string): Observable<TopicContentResponse> {
    return this.http.get<TopicContentResponse>(`topics/${topicId}`);
  }

  getExercise(topicId: string): Observable<ExerciseResponse> {
    return this.http.get<ExerciseResponse>(`topics/${topicId}/exercise`);
  }

  getExam(subjectId: string): Observable<ExamResponse> {
    return this.http.get<ExamResponse>(`subjects/${subjectId}/exam`);
  }

  scoreEssayQuestion(
    subjectId?: string,
    questionId?: string,
    answer?: string | null
  ): Observable<EssayEvaluationResponse> {
    return this.http.post<EssayEvaluationResponse>('chatbot/questions/evaluate', {
      session_id: subjectId,
      question_id: questionId,
      answer,
    });
  }

  markSubtopicAsRead(topicId: string, subtopicId: string): Observable<MarkAsReadResponse> {
    return this.http.put<MarkAsReadResponse>(`topics/${topicId}/read`, { subtopic_id: subtopicId });
  }

  saveExerciseScore(
    topicId: string | null | undefined,
    exerciseId: string | undefined,
    score: number | undefined,
    questionData: SaveQuestionData[] | undefined
  ): Observable<SaveExerciseScoreResponse> {
    return this.http.put<SaveExerciseScoreResponse>(`topics/${topicId}/exercise/score`, {
      exercise_id: exerciseId,
      score,
      question_data: questionData,
    });
  }

  saveExamScore(
    subjectId: string | undefined,
    examId: string | undefined,
    score: number | undefined,
    questionData: SaveQuestionData[] | undefined
  ): Observable<SaveExamScoreResponse> {
    return this.http.put<SaveExamScoreResponse>(`subjects/${subjectId}/exam/score`, {
      exam_id: examId,
      score,
      question_data: questionData,
    });
  }

  getGlossary(subjectId: string): Observable<GlossaryResponse> {
    return this.http.get<GlossaryResponse>(`subjects/${subjectId}/glossary`);
  }

  getFlashcards(topicId: string): Observable<FlashcardResponse> {
    return this.http.get<FlashcardResponse>(`topics/${topicId}/flashcards`);
  }

  executeCodeBlock(code: string, language: string): Observable<CodeExecutionResponse> {
    return this.http.post<CodeExecutionResponse>('topics/code/execute', { code, language });
  }
}
