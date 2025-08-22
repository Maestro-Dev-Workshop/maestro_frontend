import { Component, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

type Topic = {
  id: string,
  name: string,
  selected: boolean
}

@Component({
  selector: 'app-topic-preferences',
  imports: [Header, CreationStepTab, FormsModule],
  templateUrl: './topic-preferences.html',
  styleUrl: './topic-preferences.css'
})
export class TopicPreferences {
  learningStyle = '';
  @ViewChild('learningStyleCtrl') learningStyleCtrl!: NgModel;
  loading = false;
  topics = [
    {
      "id": "dksda-daidj2d-a2m90-1",
      "name": "Definition",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-2",
      "name": "Course Overview",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-3",
      "name": "Key Features of the Course",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-4",
      "name": "Learning Objectives",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-5",
      "name": "Course Modules",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-6",
      "name": "Assesment Methods",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-7",
      "name": "Frequently Asked Questions (FAQs)",
      "selected": false
    },
  ];

  constructor(private router: Router) {}

  toggleTopicSelection(topic_id: any) {
    this.topics.map(
      (topic) => {
        if (topic.id === topic_id) {topic.selected = !topic.selected}
      }
    )
  }

  onSubmit() {
    const selectedTopics = this.topics.filter((topic) => topic.selected);
    this.loading = true;
    if (selectedTopics.length == 0) {
      alert("At least one topic must be selected");
      this.loading = false;
      return
    }
    if (this.learningStyleCtrl.invalid) {
      alert("Learning Style is required");
      this.loading = false;
      return
    }

    // Here you would typically send the data to the backend
    console.log(selectedTopics);
    console.log(this.learningStyle);

    this.router.navigate(['/subject-create/question-settings'])
    this.loading = false;
  }
}
