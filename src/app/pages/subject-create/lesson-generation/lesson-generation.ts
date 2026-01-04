import { ChangeDetectorRef, Component, inject, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { TopicModel } from '../../../core/models/topic.model';
import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { NotificationService } from '../../../core/services/notification.service'; // <-- Add this import
import { PreferenceValidator } from '../../../shared/directives/preference-validator';
import { ExtensionConfigOverlay } from '../extension-config-overlay/extension-config-overlay';
import { max } from 'rxjs';


@Component({
  selector: 'app-lesson-generation',
  imports: [Header, CreationStepTab, FormsModule, ExtensionConfigOverlay],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './lesson-generation.html',
  styleUrl: './lesson-generation.css',
})
export class LessonGeneration {
  loading = false
  learningStyle = ''
  @ViewChild('learningStyleCtrl') learningStyleCtrl!: NgModel;
  settingsPopup = false
  configOverlay = false
  extensionsEnabled = false
  notify = inject(NotificationService)
  
  subjectName = 'Algebra';
  topics = [
    {
      "id": "dksda-daidj2d-a2m90-1",
      "title": "Introduction to Matrix",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-2",
      "title": "Matrix Operations",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-3",
      "title": "Determinants",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-4",
      "title": "Dot Products",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-5",
      "title": "Eigenvalues and Eigenvectors",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-6",
      "title": "Inverse of a Matrix",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-7",
      "title": "Singular Value Decomposition",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-8",
      "title": "Moore- Penrose Pseudoinverse",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-9",
      "title": "Theorems",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-10",
      "title": "Matrix Analysis",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-11",
      "title": "Out of Topics Ideas",
      "selected": false
    },
    {
      "id": "dksda-daidj2d-a2m90-12",
      "title": "Mehn, why I dey sick like this",
      "selected": false
    },
  ];
  extensionSettings = {
    exercise: {
      enabled: false,
      types: [],
      numQuestions: 3,
      name: 'exercise'
    },
    exam: {
      enabled: false,
      types: [],
      numQuestions: 10,
      timelimit: null,
      name: 'exam'
    },
    flashcards: {
      enabled: false,
      numCards: 5,
      types: [],
      name: 'flashcards'
    },
    glossary: {
      enabled: false,
      name: 'glossary'
    }
  }
  constraints = {
    excercise: {
      maxQuestions: 10
    },
    exam: {
      maxQuestions: 50
    },
    flashcards: {
      maxCards: 20
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  toggleTopicSelection(topic_id: any) {
    this.topics.map(
      (topic) => {
        if (topic.id === topic_id) {topic.selected = !topic.selected}
      }
    )
  }

  toggleSettingsPopup() {
    this.settingsPopup = !this.settingsPopup
  }

  toggleConfigOverlay() {
    this.configOverlay = !this.configOverlay
  }

  saveConfig(config: any) {
    this.extensionSettings = config
    this.toggleConfigOverlay()
  }

  toggleExtension(extension: string) {
    this.extensionSettings[extension as keyof typeof this.extensionSettings].enabled = !this.extensionSettings[extension as keyof typeof this.extensionSettings].enabled
    this.extensionsEnabled = Object.values(this.extensionSettings).some((ext: any) => ext.enabled);
  }

  getExtensionList() {
    return Object.values(this.extensionSettings).filter((ext: any) => ext.enabled);
  }

  validateSettings() {
    // Check if any topics have been selected
    const selectedTopics = this.topics.filter(topic => topic.selected);
    if (selectedTopics.length === 0) {
      return {
        status: false,
        message: 'Please select at least one topic.'
      };
    }

    // Check if learning style is empty
    if (!this.learningStyle || this.learningStyle.trim() === '') {
      return {
        status: false,
        message: 'Learning style cannot be empty.'
      };
    }
    if (this.learningStyle.length > 2000) {
      return {
        status: false,
        message: 'Learning style cannot exceed 2000 characters.'
      };
    }

    // Exercise checks
    if (this.extensionSettings.exercise.enabled) {
      if (this.extensionSettings.exercise.numQuestions <= 0 || this.extensionSettings.exercise.numQuestions > this.constraints.excercise.maxQuestions) {
        return {
          status: false,
          message: `Number of exercise questions must be between 1 and ${this.constraints.excercise.maxQuestions}.`
        };
      }
      if (this.extensionSettings.exercise.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one question type for exercise.'
        };
      }
    }

    // Exam checks
    if (this.extensionSettings.exam.enabled) {
      if (this.extensionSettings.exam.numQuestions <= 0 || this.extensionSettings.exam.numQuestions > this.constraints.exam.maxQuestions) {
        return {
          status: false,
          message: `Number of exam questions must be between 1 and ${this.constraints.exam.maxQuestions}.`
        };
      }
      if (this.extensionSettings.exam.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one question type for exam.'
        };
      }
    }

    // Flashcards checks
    if (this.extensionSettings.flashcards.enabled) {
      if (this.extensionSettings.flashcards.numCards <= 0 || this.extensionSettings.flashcards.numCards > this.constraints.flashcards.maxCards) {
        return {
          status: false,
          message: `Number of flashcards must be between 1 and ${this.constraints.flashcards.maxCards}.`
        };
      }
      if (this.extensionSettings.flashcards.types.length === 0) {
        return {
          status: false,
          message: 'Please select at least one type for flashcards.'
        };
      }
    }

    return {
      status: true,
      message: 'Settings are valid.'
    };
  }

  go() {
    this.loading = true;
    this.settingsPopup = false
    this.configOverlay = false

    const validation = this.validateSettings();
    if (!validation.status) {
      this.notify.showError(validation.message);
      this.loading = false;
      return;
    }

    this.notify.showSuccess(validation.message);
    console.log(this.extensionSettings)
    this.loading = false;
  }
}
