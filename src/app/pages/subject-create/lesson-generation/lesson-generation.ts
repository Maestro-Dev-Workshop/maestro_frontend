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

  go() {
    console.log(this.extensionSettings)
  }
}
