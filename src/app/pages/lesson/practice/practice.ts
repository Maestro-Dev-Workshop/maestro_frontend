import { ChangeDetectorRef, Component, effect, inject, input, OnInit, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionModel, SaveQuestionData } from '../../../core/models/question.model';
import { LessonService } from '../../../core/services/lesson.service';
import { catchError, forkJoin, Observable, of, switchMap, take, tap } from 'rxjs';
import { MarkdownPipe } from '../../../shared/pipes/markdown-pipe';
import { NotificationService } from '../../../core/services/notification.service';

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
  notify = inject(NotificationService);
  lessonService = inject(LessonService);

  constructor(private cdr: ChangeDetectorRef) {}

  // This will run any time currentView changes
  private updateOnInputChange = effect(() => {
    const view = this.currentView(); // <-- THIS is reactive
    if (view?.content?.questions?.length) {
      this.goToQuestion(0);
    }
  });

  // Not necessary
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  goToQuestion(index: number) {
    this.currentIndex = index;
    this.question = this.currentView().content.questions[this.currentIndex];
    console.log(this.question)
    this.changeQuestion.emit({id: this.question.id})
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
    console.log(this.currentView()?.content?.questions.find((q: any) => q.id === this.question.id)?.options);
  }

  submitAnswers() {
    const proceed = confirm("Are you sure you want to submit?")
    if (!proceed) return

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
              console.log(value)
              if (value.correct) {
                q.scored = true;
                this.currentView().content.questions.find((q: any) => q.id === question.id).scored = true;
                correctCount++;
              } 
              q.essay_answer = question.essay_answer;
              q.essay_feedback = question.essay_feedback = value.feedback;
            }),
            catchError(res => {
              console.error(`Error scoring essay question: ${res}`);
              this.notify.showError(res.error.message || 'Failed to score an essay question.');
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
      console.log(questionData)
      saveCall$ = this.lessonService.saveExerciseScore(this.topicId(), this.currentView().id, correctCount, questionData).pipe(
        tap(() => this.exerciseCompleted.emit(this.topicId()))
        );
    } else if (this.currentView().type === 'exam') {
      console.log(questionData)
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
        console.error('Failed to submit answers:', res);
        this.notify.showError(res.error.message || 'Failed to submit answers. Please try again.');
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

}
