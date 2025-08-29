import { Component, effect, inject, input, OnInit, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { QuestionModel, SaveQuestionData } from '../../../core/models/question.model';
import { LessonService } from '../../../core/services/lesson.service';
import { catchError, forkJoin, Observable, of, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-practice',
  imports: [FormsModule, MarkdownModule],
  templateUrl: './practice.html',
  styleUrl: './practice.css'
})
export class Practice {
  currentView = input<any>();
  subjectId = input<string>();
  topicId = input<string | null>()
  changeQuestion = output<any>();
  exerciseCompleted = output<any>();
  question: any;
  loading = false;
  lessonService = inject(LessonService)

  // This will run any time currentView changes
  private updateOnInputChange = effect(() => {
    const view = this.currentView(); // <-- THIS is reactive
    if (view?.content?.questions?.length) {
      this.question = view.content.questions[0];
      this.changeQuestion.emit({ id: this.question.id })
    }
  });

  // Not necessary
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  cycleQuestion(direction: string) {
    const currentIndex = this.currentView().content.questions.findIndex((q: any) => q.id === this.question.id);

    let newIndex = currentIndex + (direction === 'next' ? 1 : -1);
    if (newIndex < 0) newIndex = 0; // Caps previous question at first question
    if (newIndex >= this.currentView().content.questions.length) newIndex = this.currentView().content.questions.length - 1; // Caps next question at last question

    this.question = this.currentView().content.questions[newIndex]
    console.log(this.question)
    this.changeQuestion.emit({id: this.question.id})
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
    this.loading = true;

    let correctCount = 0;
    let questionData: SaveQuestionData[] = [];

    const essayCalls: Observable<any>[] = [];

    this.currentView().content.questions.forEach((question: QuestionModel) => {
      let q: SaveQuestionData = {
        id: question.id,
        type: question.type,
        options: [],
        essay_answer: null,
        essay_feedback: null
      };

      if (question.type === 'multiple choice' || question.type === 'multiple selection') {
        const isCorrect = question.options?.every(opt => opt.selected === opt.correct);
        if (isCorrect) correctCount++;
        q.options = question.options?.map(opt => ({ id: opt.id, selected: opt.selected }));
      } 
      
      else if (question.type === 'essay') {
        essayCalls.push(
          this.lessonService.scoreEssayQuestion(this.subjectId(), question.id, question.essay_answer).pipe(
            tap((value) => {
              if (value.correct) correctCount++;
              q.essay_answer = question.essay_answer;
              q.essay_feedback = question.essay_feedback = value.feedback;
            }),
            catchError(err => {
              console.error(`Error scoring essay question: ${err}`);
              return of(null);
            })
          )
        );
      }

      questionData.push(q); // this might seem counterintuitive, but it actually does work with the async essay scoring, trust me bro, I asked gpt
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
        this.loading = false; // ✅ only after scoring + saving
      },
      error: (err) => {
        console.error('Failed to submit answers:', err);
        this.loading = false;
      }
    });
  }

}
