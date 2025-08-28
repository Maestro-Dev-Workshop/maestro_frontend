import { Component, effect, input, OnInit, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-practice',
  imports: [FormsModule, MarkdownModule],
  templateUrl: './practice.html',
  styleUrl: './practice.css'
})
export class Practice {
  currentView = input<any>();
  changeQuestion = output<any>();
  question: any;
  loading = false;

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
    // score exercise/exam
    // emit check for completed topic
    this.loading = false;
  }
}
