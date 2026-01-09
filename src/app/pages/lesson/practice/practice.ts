import { ChangeDetectorRef, Component, effect, ElementRef, inject, input, OnInit, output, SimpleChanges, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionModel, SaveQuestionData } from '../../../core/models/question.model';
import { LessonService } from '../../../core/services/lesson.service';
import { catchError, forkJoin, Observable, of, switchMap, take, tap } from 'rxjs';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { NotificationService } from '../../../core/services/notification.service';
import { ConfirmService } from '../../../core/services/confirm';

@Component({
  selector: 'app-practice',
  imports: [FormsModule, MarkdownPipe],
  templateUrl: './practice.html',
  styleUrl: './practice.css'
})
export class Practice {
  currentView = input<any>();
  subjectId = input<string>();
  topicId = input<string | null>()
  changeQuestion = output<any>();
  exerciseCompleted = output<any>();
  changeProgress = output<any>();
  question: any;
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
    this.currentIndex = index;
    this.question = this.currentView().content.questions[this.currentIndex];
    this.changeQuestion.emit({id: this.question.id})
    this.scrollToTop();
  }

  cycleQuestion(direction: string) {
    // const currentIndex = this.currentView().content.questions.findIndex((q: any) => q.id === this.question.id);
    let index = this.currentIndex
    index += (direction === 'next' ? 1 : -1);
    if (index < 0) index = 0; // Caps previous question at first question
    if (index >= this.currentView().content.questions.length) index = this.currentView().content.questions.length - 1; // Caps next question at last question
    this.goToQuestion(index);
  }

  getQuestionNumber() {
    return this.currentView().content.questions.findIndex((q: any) => q.id === this.question.id) + 1;
  }

  toggleSelectOption(id: any) {
    if (this.question.type === 'multiple choice') {
      this.question.options.forEach((option: any) => {
        option.selected = option.id === id;
      });
    } else if (this.question.type === 'multiple selection') {
      const option = this.question.options.find((o: any) => o.id === id);
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
    this.loading = true;

    let correctCount = 0;
    let questionData: SaveQuestionData[] = [];

    const essayCalls: Observable<any>[] = [];

    this.currentView().content.questions.forEach((question: QuestionModel) => {
      this.currentView().content.questions.find((q: any) => q.id === question.id).scored = false;
      let q: SaveQuestionData = {
        id: question.id,
        type: question.type,
        scored: false,
        options: [],
        essay_answer: null,
        essay_feedback: null
      };

      if (question.type === 'multiple choice' || question.type === 'multiple selection') {
        const isCorrect = question.options?.every(opt => opt.selected === opt.correct);
        if (isCorrect){
          q.scored = true;
          this.currentView().content.questions.find((q: any) => q.id === question.id).scored = true;
          correctCount++;
        } 
        q.options = question.options?.map(opt => ({ id: opt.id, selected: opt.selected }));
      } 
      
      else if (question.type === 'essay') {
        if (!question.essay_answer) question.essay_answer = "<no-answer-provided>"
        essayCalls.push(
          this.lessonService.scoreEssayQuestion(this.subjectId(), question.id, question.essay_answer).pipe(
            tap((value) => {
              if (value.correct) {
                q.scored = true;
                this.currentView().content.questions.find((q: any) => q.id === question.id).scored = true;
                correctCount++;
              } 
              q.essay_answer = question.essay_answer;
              q.essay_feedback = question.essay_feedback = value.feedback;
            }),
            catchError(res => {
              this.notify.showError(res.error.displayMessage || 'Failed to score an essay question.');
              return of(null);
            })
          )
        );
      }

      questionData.push(q); // this might seem counterintuitive, but it actually does work with the async essay scoring, trust me bro, I asked gpt... I lied, it doesn't work
    });

    // save score observable
    let saveCall$: Observable<any>;
    if (this.currentView().type === 'exercise') {
      saveCall$ = this.lessonService.saveExerciseScore(this.topicId(), this.currentView().id, correctCount, questionData).pipe(
        tap(() => this.exerciseCompleted.emit(this.topicId()))
        );
    } else if (this.currentView().type === 'exam') {
      saveCall$ = this.lessonService.saveExamScore(this.subjectId(), this.currentView().id, correctCount, questionData);
    } else {
      saveCall$ = of(null);
    }

    // run essay scoring first, then save score
    forkJoin(essayCalls.length > 0 ? essayCalls : [of(null)]).pipe(
      switchMap(() => {
        // Save final score into the currentView
        this.currentView().content.score = correctCount;
        return saveCall$;
      })
    ).subscribe({
      next: () => {
        this.changeProgress.emit({}); // Notify parent to refresh progress
        this.loading = false; // ✅ only after scoring + saving
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || 'Failed to submit answers. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
