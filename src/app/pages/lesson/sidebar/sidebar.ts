import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  content = input<any>();
  currentView = input<any>();
  updateView = output<any>();

  logContent() {
    console.log(this.content());
  }

  toggleExpandTopic(topic_id: string) {
    const topic = this.content().topics.find((t: any) => t.id === topic_id);
    if (topic) {
      topic.expanded = !topic.expanded;
    }
  }

  selectView(id: string, type: string) {
    console.log(`Selected view: ${type} with ID: ${id}`);
    this.updateView.emit({ id, type });
  }
}
