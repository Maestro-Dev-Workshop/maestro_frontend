import { ChangeDetectorRef, Component, inject, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicModel } from '../../../core/models/topic.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { PreferenceValidator } from '../../../shared/directives/preference-validator';

type Topic = {
  id: string,
  name: string,
  selected: boolean
}

@Component({
  selector: 'app-topic-preferences',
  imports: [Header, CreationStepTab, FormsModule, PreferenceValidator],
  templateUrl: './topic-preferences.html',
  styleUrl: './topic-preferences.css'
})
export class TopicPreferences implements OnInit {
  learningStyle = '';
  subjectId = '';
  @ViewChild('learningStyleCtrl') learningStyleCtrl!: NgModel;
  loading = false;
  old_topics = [
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
  topics: TopicModel[] = [];
  subjectService = inject(SubjectsService)
  lessonService = inject(LessonService)
  notify = inject(NotificationService)

  constructor(private router: Router, private cdr: ChangeDetectorRef) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 2]; // Assuming the last part is the subjectId
  }

  toggleTopicSelection(topic_id: any) {
    this.topics.map(
      (topic) => {
        if (topic.id === topic_id) {topic.selected = !topic.selected}
      }
    )
  }

  ngOnInit(): void {
    // Fetch topics from backend
    this.lessonService.getAllTopics(this.subjectId).subscribe({
      next: (response) => {
        this.topics = response.topics
        this.cdr.detectChanges();
      },
      error: (res) => {
        this.notify.showError(res.error.displayMessage || "Failed to load topics. Please try again later.");
      }
    });
  }

  onSubmit() {
    const selectedTopics = this.topics.filter((topic) => topic.selected);
    this.loading = true;
    if (selectedTopics.length == 0) {
      this.notify.showError("At least one topic must be selected");
      this.loading = false;
      return
    }
    if (this.learningStyleCtrl.invalid) {
      this.notify.showError("Learning Style cannot be empty or exceed 1000 characters");
      this.loading = false;
      return
    }

    // Select topics
    this.subjectService.selectTopics(this.subjectId, selectedTopics.map((topic) => topic.id)).subscribe({
      next: (response) => {
        
        // Generate lesson
        this.subjectService.generateLesson(this.subjectId, this.learningStyle).subscribe({
          next: (response) => {
            this.notify.showSuccess("Successfully generated lesson.")
            this.router.navigate([`/subject-create/${this.subjectId}/question-settings`])
            this.loading = false;
          },

          error: (res) => {
            this.loading = false;
            this.notify.showError(res.error.displayMessage || "Failed to generate lesson. Please try again later.");
            this.loading = false;
            this.cdr.detectChanges();
          }
        });
      },
      
      error: (res) => {
        this.loading = false;
        this.notify.showError(res.error.displayMessage || "Failed to select topics. Please try again later.");
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
