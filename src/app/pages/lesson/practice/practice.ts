import { Component, effect, input, OnInit, output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice',
  imports: [FormsModule],
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
      this.changeQuestion.emit({ id: this.question.question_id })
    }
  });

  // Not necessary
  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  cycleQuestion(direction: string) {
    const currentIndex = this.currentView().content.questions.findIndex((q: any) => q.question_id === this.question.question_id);

    let newIndex = currentIndex + (direction === 'next' ? 1 : -1);
    if (newIndex < 0) newIndex = 0; // Caps previous question at first question
    if (newIndex >= this.currentView().content.questions.length) newIndex = this.currentView().content.questions.length - 1; // Caps next question at last question

    this.question = this.currentView().content.questions[newIndex]
    console.log(this.question)
    this.changeQuestion.emit({id: this.question.question_id})
  }

  getQuestionNumber() {
    return this.currentView().content.questions.findIndex((q: any) => q.question_id === this.question.question_id) + 1;
  }

  toggleSelectOption(option_id: any) {
    if (this.question.question_type === 'multiple choice') {
      this.question.options.forEach((option: any) => {
        option.selected = option.option_id === option_id;
      });
    } else if (this.question.question_type === 'multiple selection') {
      const option = this.question.options.find((o: any) => o.option_id === option_id);
      if (option) {
        option.selected = !option.selected;
      }
    }
    console.log(this.currentView()?.content?.questions.find((q: any) => q.question_id === this.question.question_id)?.options);
  }

  submitAnswers() {
    this.loading = true;
    // score exercise/exam
    // emit check for completed topic
    this.loading = false;
  }
}
