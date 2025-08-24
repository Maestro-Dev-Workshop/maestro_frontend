import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice',
  imports: [FormsModule],
  templateUrl: './practice.html',
  styleUrl: './practice.css'
})
export class Practice {
  currentView = input<any>();

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }  

  toggleSelectOption(question: any, option_id: any) {
    // if question is multiple choice, unselect all other options and select only the one with the matching ID
    // if the question is multiple selection, toggle the selected state of the option with the matching ID
    if (question.question_type === 'multiple choice') {
      question.options.forEach((option: any) => {
        option.selected = option.option_id === option_id;
      });
    } else if (question.question_type === 'multiple selection') {
      const option = question.options.find((o: any) => o.option_id === option_id);
      if (option) {
        option.selected = !option.selected;
      }
    }
    console.log(this.currentView()?.content?.questions.find((q: any) => q.question_id === question.question_id)?.options);
  }

  submitAnswers() {

  }
}
