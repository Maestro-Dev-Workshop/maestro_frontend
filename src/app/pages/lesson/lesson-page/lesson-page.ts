import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { Subtopic } from '../subtopic/subtopic';
import { Exercise } from '../exercise/exercise';
import { Exam } from '../exam/exam';

@Component({
  selector: 'app-lesson-page',
  imports: [Header, Sidebar, Chatbot, Subtopic, Exercise, Exam],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css'
})
export class LessonPage {
  subjectId: string;
  subjectContent: any = {
    subject_name: 'Geography',
    topics: [
      {
        topic_id: 't1',
        topic_name: 'Intro to Geography',
        expanded: false,
        subtopics: [
          {
            subtopic_id: 's1-t1',
            subtopic_name: 'Geography Basics',
            content: 'Geography is the study of places and the relationships between people and their environments.'
          },
          {
            subtopic_id: 's2-t1',
            subtopic_name: 'World Capitals',
            content: 'A capital city is the most important city in a country, often where the government is located.'
          },
          {
            subtopic_id: 's3-t1',
            subtopic_name: 'Physical Geography',
            content: 'Physical geography focuses on the natural environment, including landforms, climates, and ecosystems.'
          }
        ],
        exercise: {
          exercise_id: 'et1',
          questions: [
            {
              question_id: 'q1-et1',
              question_text: 'What is the capital of France?',
              question_type: 'multiple_choice',
              options: [
                { option_id: '1', option_text: 'Paris', is_correct: true },
                { option_id: '2', option_text: 'London', is_correct: false },
                { option_id: '3', option_text: 'Berlin', is_correct: false },
                { option_id: '4', option_text: 'Madrid', is_correct: false }
              ]
            },
            {
              question_id: 'q2-et2',
              question_text: 'Which of these are oceans on earth?',
              question_type: 'multiple_selection',
              options: [
                { option_id: '1', option_text: 'Atlantic Ocean', is_correct: true },
                { option_id: '2', option_text: 'Pacific Ocean', is_correct: true },
                { option_id: '3', option_text: 'Amazon River', is_correct: false },
                { option_id: '4', option_text: 'Nile River', is_correct: false }
              ]
            },
            {
              question_id: 'q3-et3',
              question_text: 'Describe the importance of studying geography in understanding global issues.',
              question_type: 'essay',
            }
          ]
        }
      },
      {
        topic_id: 't2',
        topic_name: 'Physical Geography',
        expanded: false,
        subtopics: [
          {
            subtopic_id: 's1-t2',
            subtopic_name: 'Climate Zones',
            content: 'Climate zones are regions of the world with distinct weather patterns and temperatures.'
          },
          {
            subtopic_id: 's2-t2',
            subtopic_name: 'Human Geography',
            content: 'Human geography studies how humans interact with the environment and how cultures vary across regions.'
          }
        ],
        exercise: {
          exercise_id: 'et2',
          questions: [
            {
              question_id: 'q1-et2',
              question_text: 'What are the main climate zones of the world?',
              question_type: 'multiple_choice',
              options: [
                { option_id: '1', option_text: 'Tropical', is_correct: true },
                { option_id: '2', option_text: 'Arctic', is_correct: true },
                { option_id: '3', option_text: 'Desert', is_correct: true },
                { option_id: '4', option_text: 'Mountainous', is_correct: false }
              ]
            },
            {
              question_id: 'q2-et2',
              question_text: 'Explain how human activities impact the environment.',
              question_type: 'essay',
            }
          ]
        }
      }
    ],
    exam: {
      exam_id: 'e1',
      questions: [
        {
          question_id: 'q1-e1',
          question_text: 'What is the largest continent on Earth?',
          question_type: 'multiple_choice',
          options: [
            { option_id: '1', option_text: 'Asia', is_correct: true },
            { option_id: '2', option_text: 'Africa', is_correct: false },
            { option_id: '3', option_text: 'North America', is_correct: false },
            { option_id: '4', option_text: 'Europe', is_correct: false }
          ]
        },
        {
          question_id: 'q2-e1',
          question_text: 'Describe the water cycle and its significance in geography.',
          question_type: 'essay',
        }
      ]
    }
  }
  currentView = {
    type: 'subtopic', // 'subtopic', 'exercise', or 'exam'
    id: '', // ID of the current subtopic, exercise question, or exam question
    content: {} // Content to display based on the current view
  }

  constructor() {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 1]; // Assuming the last part is the subjectId
  }

  updateCurrentView(event: any) {
    this.currentView.type = event.type;
    this.currentView.id = event.id;

    if (event.type === 'subtopic') {
      this.currentView.content = this.subjectContent.topics
        .flatMap((topic: any) => topic.subtopics)
        .find((subtopic: any)=> subtopic.subtopic_id === event.id) || {};
    } else if (event.type === 'exercise') {
      this.currentView.content = this.subjectContent.topics
        .flatMap((topic: any) => topic.exercise)
        .find((exercise: any) => exercise.exercise_id === event.id) || {};
    } else if (event.type === 'exam') {
      this.currentView.content = this.subjectContent.exam
    }

    console.log(this.currentView)
  }
}
