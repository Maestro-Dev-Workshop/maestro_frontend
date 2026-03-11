import { ChangeDetectorRef, Component, effect, ElementRef, inject, input, output, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionModel, QuestionOption, SaveQuestionData } from '../../../core/models/question.model';
import { LessonService } from '../../../core/services/lesson.service';
import { catchError, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmService } from '../../../core/services/confirm';
import { ThemeIconComponent } from '../../../shared/components/theme-icon/theme-icon';
import { LessonViewState, QuestionChangeEvent } from '../../../core/models/lesson-content.model';
import { ExerciseModel } from '../../../core/models/exercise.model';
import { ExamModel } from '../../../core/models/exam.model';
import { EssayEvaluationResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-practice',
  imports: [FormsModule, MarkdownPipe, ThemeIconComponent],
  templateUrl: './practice.html',
  styleUrl: './practice.css'
})
/** View data with questions for practice mode */
interface PracticeViewData {
  type: 'exercise' | 'exam';
  id: string;
  content: ExerciseModel | ExamModel;
}

export class Practice {
  currentView = input<PracticeViewData>();
  subjectId = input<string>();
  topicId = input<string | null>()
  changeQuestion = output<QuestionChangeEvent>();
  exerciseCompleted = output<string | null>();
  changeProgress = output<void>();
  question: QuestionModel | null = null;
  currentIndex = 0;
  loading = false;
  showSubmitConfirmation = false;
  notify = inject(NotificationService);
  lessonService = inject(LessonService);
  confirmation = inject(ConfirmService);
  viewContainer = viewChild<ElementRef>('viewContainer');

  constructor(private cdr: ChangeDetectorRef) {}

  // This will run any time currentView changes
  private updateOnInputChange = effect(() => {
    const view = this.currentView(); // <-- THIS is reactive
    if (view?.content?.questions?.length) {
      untracked(() => {
        setTimeout(() => this.scrollToTop(), 0);
      });
      this.goToQuestion(0);
    }
  });

  scrollToTop() {
    const element = this.viewContainer();
    if (element?.nativeElement) {
      element.nativeElement.scrollTop = 0;
    }
  }

  // Not necessary
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  goToQuestion(index: number) {
    const view = this.currentView();
    if (!view) return;
    this.currentIndex = index;
    this.question = view.content.questions[this.currentIndex];
    if (this.question) {
      this.changeQuestion.emit({ id: this.question.id });
    }
    this.scrollToTop();
  }

  cycleQuestion(direction: string) {
    const view = this.currentView();
    if (!view) return;
    let index = this.currentIndex;
    index += (direction === 'next' ? 1 : -1);
    if (index < 0) index = 0; // Caps previous question at first question
    if (index >= view.content.questions.length) index = view.content.questions.length - 1; // Caps next question at last question
    this.goToQuestion(index);
  }

  getQuestionNumber(): number {
    const view = this.currentView();
    if (!view || !this.question) return 0;
    return view.content.questions.findIndex((q) => q.id === this.question!.id) + 1;
  }

  toggleSelectOption(id: string) {
    if (!this.question || !this.question.options) return;
    if (this.question.type === 'multiple choice') {
      this.question.options.forEach((option: QuestionOption) => {
        option.selected = option.id === id;
      });
    } else if (this.question.type === 'multiple selection') {
      const option = this.question.options.find((o) => o.id === id);
      if (option) {
        option.selected = !option.selected;
      }
    }
  }

  openSubmit() {
    this.confirmation.open({
      title: 'Submit Answers',
      message: 'Are you sure you want to submit your answers? You will not be able to change them afterwards.',
      okText: 'Submit',
      cancelText: 'Cancel'
    }).subscribe((confirmed) => {
      if (confirmed) {
        this.submitAnswers();
      }
    });
  }

  submitAnswers() {
    const view = this.currentView();
    if (!view) return;

    this.loading = true;

    let correctCount = 0;
    const questionData: SaveQuestionData[] = [];

    const essayCalls: Observable<EssayEvaluationResponse | null>[] = [];

    view.content.questions.forEach((question: QuestionModel) => {
      const targetQuestion = view.content.questions.find((q) => q.id === question.id);
      if (targetQuestion) targetQuestion.scored = false;

      const q: SaveQuestionData = {
        id: question.id,
        type: question.type,
        scored: false,
        options: [],
        essay_answer: null,
        essay_feedback: null
      };

      if (question.type === 'multiple choice' || question.type === 'multiple selection') {
        const isCorrect = question.options?.every(opt => opt.selected === opt.correct);
        if (isCorrect) {
          q.scored = true;
          const targetQ = view.content.questions.find((qItem) => qItem.id === question.id);
          if (targetQ) targetQ.scored = true;
          correctCount++;
        }
        q.options = question.options?.map(opt => ({ id: opt.id, selected: opt.selected }));
      }

      else if (question.type === 'essay') {
        if (!question.essay_answer) question.essay_answer = "<no-answer-provided>";
        essayCalls.push(
          this.lessonService.scoreEssayQuestion(this.subjectId(), question.id, question.essay_answer).pipe(
            tap((value) => {
              if (value.correct) {
                q.scored = true;
                const targetQ = view.content.questions.find((qItem) => qItem.id === question.id);
                if (targetQ) targetQ.scored = true;
                correctCount++;
              }
              q.essay_answer = question.essay_answer;
              q.essay_feedback = question.essay_feedback = value.feedback ?? null;
            }),
            catchError(res => {
              this.notify.showError(res.error?.message || 'Failed to score an essay question.');
              return of(null);
            })
          )
        );
      }

      questionData.push(q);
    });

    // save score observable
    let saveCall$: Observable<unknown>;
    if (view.type === 'exercise') {
      saveCall$ = this.lessonService.saveExerciseScore(this.topicId(), view.id, correctCount, questionData).pipe(
        tap(() => this.exerciseCompleted.emit(this.topicId()))
      );
    } else if (view.type === 'exam') {
      saveCall$ = this.lessonService.saveExamScore(this.subjectId(), view.id, correctCount, questionData);
    } else {
      saveCall$ = of(null);
    }

    // run essay scoring first, then save score
    forkJoin(essayCalls.length > 0 ? essayCalls : [of(null)]).pipe(
      switchMap(() => {
        // Save final score into the currentView
        (view.content as ExerciseModel | ExamModel).score = correctCount;
        return saveCall$;
      })
    ).subscribe({
      next: () => {
        this.changeProgress.emit(); // Notify parent to refresh progress
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error?.message || 'Failed to submit answers. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
