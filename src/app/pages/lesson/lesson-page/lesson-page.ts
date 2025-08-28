import { Component, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { Subtopic } from '../subtopic/subtopic';
import { Practice } from "../practice/practice";

@Component({
  selector: 'app-lesson-page',
  imports: [Header, Sidebar, Chatbot, Subtopic, Practice],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css'
})
export class LessonPage {
  subjectId: string;
  subjectContent: any = {
    subject_name: 'Geography',
    topics: [
      {
        expanded: false,
        topic_id: 't1',
        topic_name: 'Intro to Geography',
        completed: false,
        subtopics: [
          {
            subtopic_id: 's1-t1',
            subtopic_name: 'Geography Basics',
            content: 'Geography is the study of places and the relationships between people and their environments.',
            read: true
          },
          {
            subtopic_id: 's2-t1',
            subtopic_name: 'World Capitals',
            content: 'A capital city is the most important city in a country, often where the government is located.',
            read: false
          },
          {
            subtopic_id: 's3-t1',
            subtopic_name: 'Physical Geography',
            content: 'Physical geography focuses on the natural environment, including landforms, climates, and ecosystems.',
            read: false
          }
        ],
        exercise: {
          exercise_id: 'et1',
          score: null,
          questions: [
            {
              question_id: 'q1-et1',
              question_text: 'What is the capital of France?',
              question_type: 'multiple choice',
              options: [
                { option_id: '1', option_text: 'Paris', is_correct: true, selected: false },
                { option_id: '2', option_text: 'London', is_correct: false, selected: false },
                { option_id: '3', option_text: 'Berlin', is_correct: false, selected: false },
                { option_id: '4', option_text: 'Madrid', is_correct: false, selected: false }
              ]
            },
            {
              question_id: 'q2-et1',
              question_text: 'Which of these are oceans on earth?',
              question_type: 'multiple selection',
              options: [
                { option_id: '1', option_text: 'Atlantic Ocean', is_correct: true, selected: false },
                { option_id: '2', option_text: 'Pacific Ocean', is_correct: true, selected: false },
                { option_id: '3', option_text: 'Amazon River', is_correct: false, selected: false },
                { option_id: '4', option_text: 'Nile River', is_correct: false, selected: false }
              ]
            },
            {
              question_id: 'q3-et1',
              question_text: 'Describe the importance of studying geography in understanding global issues.',
              question_type: 'essay',
            }
          ]
        }
      },
      {
        expanded: false,
        topic_id: 't2',
        topic_name: 'Physical Geography',
        completed: true,
        subtopics: [
          {
            subtopic_id: 's1-t2',
            subtopic_name: 'Climate Zones',
            content: 'Climate zones are regions of the world with distinct weather patterns and temperatures.',
            read: true
          },
          {
            subtopic_id: 's2-t2',
            subtopic_name: 'Human Geography',
            content: 'Human geography studies how humans interact with the environment and how cultures vary across regions.',
            read: true
          }
        ],
        exercise: {
          exercise_id: 'et2',
          score: 2,
          questions: [
            {
              question_id: 'q1-et2',
              question_text: 'What are the main climate zones of the world?',
              question_type: 'multiple selection',
              options: [
                { option_id: '1', option_text: 'Tropical', is_correct: true, selected: true },
                { option_id: '2', option_text: 'Arctic', is_correct: true, selected: true },
                { option_id: '3', option_text: 'Desert', is_correct: true, selected: true },
                { option_id: '4', option_text: 'Mountainous', is_correct: false, selected: false }
              ]
            },
            {
              question_id: 'q2-et2',
              question_text: 'Explain how human activities impact the environment.',
              question_type: 'essay',
              answer: 'Human activities such as deforestation, pollution, and urbanization significantly impact the environment by altering ecosystems, contributing to climate change, and reducing biodiversity.'
            }
          ]
        }
      }
    ],
    exam: {
      exam_id: 'e1',
      score: null,
      questions: [
        {
          question_id: 'q1-e1',
          question_text: 'What is the largest continent on Earth?',
          question_type: 'multiple choice',
          options: [
            { option_id: '1', option_text: 'Asia', is_correct: true, selected: false },
            { option_id: '2', option_text: 'Africa', is_correct: false, selected: false },
            { option_id: '3', option_text: 'North America', is_correct: false, selected: false },
            { option_id: '4', option_text: 'Europe', is_correct: false, selected: false }
          ]
        },
        {
          question_id: 'q2-e1',
          question_text: 'Describe the water cycle and its significance in geography.',
          question_type: 'essay',
          answer: null
        }
      ]
    }
  }
  currentView: any = {
    type: 'subtopic', // 'subtopic', 'exercise', or 'exam'
    id: '', // ID of the current subtopic, exercise question, or exam question
    content: {} // Content to display based on the current view
  }
  chatOpen = false;
  chatHistory = [
    {
      sender: "user",
      message: "Hello",
      timestamp: ""
    },
    {
      sender: "assistant",
      message: "Hi there, how can I help you?",
      timestamp: ""
    },
  ]
  chatMetadata: any = {
    topic_name: null,
    topic_id: null,
    sub_topic_name: null,
    sub_topic_id: null,
    exercise_id: null,
    exam_id: null,
    question_id: null
  }

  constructor() {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 1]; // Assuming the last part is the subjectId
  }

  updatecurrentView(event: any) {
    let content = null;

    if (event.type === 'subtopic') {
      content = this.subjectContent.topics
        .flatMap((topic: any) => topic.subtopics)
        .find((subtopic: any)=> subtopic.subtopic_id === event.id) || {};
      // mark subtopic as read
      // check for completed topic
      } else if (event.type === 'exercise') {
        content = this.subjectContent.topics
        .flatMap((topic: any) => topic.exercise)
        .find((exercise: any) => exercise.exercise_id === event.id) || {};
      } else if (event.type === 'exam') {
        content = this.subjectContent.exam
      }
      
    this.currentView = {
      id: event.id,
      type: event.type,
      content: content
    }
    if (event.type === 'subtopic') this.updateChatMetadata();
    console.log(this.currentView)
  }
  
  getTopicDataFromSubtopic() {
    const topicData = this.subjectContent.topics.find((topic: any) => topic.subtopics.some((subtopic: any) => subtopic.subtopic_id === this.currentView.id));
    return { topic_id: topicData?.topic_id, topic_name: topicData?.topic_name};
  }

  getTopicDataFromExercise() {
    const topicData = this.subjectContent.topics.find((topic: any) => topic.exercise && topic.exercise.exercise_id === this.currentView.id);
    return { topic_id: topicData?.topic_id, topic_name: topicData?.topic_name};
  }

  // Updates the current view to the previous or next subtopic
  changeSubtopic(event: any) {
    const topic_id = event.topic_id
    const direction = event.direction;

    const topic = this.subjectContent.topics.find((t: any) => t.topic_id === topic_id);
    if (!topic) return;

    const subtopics = topic.subtopics;
    const currentIndex = subtopics.findIndex((s: any) => s.subtopic_id === this.currentView.id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + (direction === 'next' ? 1 : -1);
    if (newIndex < 0) newIndex = 0; // Caps previus subtopic at first subtopic
    if (newIndex >= subtopics.length) subtopics.length - 1; // Caps next subtopic at last subtopic

    this.updatecurrentView({ id: subtopics[newIndex].subtopic_id, type: 'subtopic'})
  }

  updateChatMetadata(question_event? : any) {
    if (this.currentView.type === 'subtopic') {
      const topicData = this.getTopicDataFromSubtopic()
      this.chatMetadata.topic_id = topicData.topic_id
      this.chatMetadata.topic_name = topicData.topic_name
      this.chatMetadata.sub_topic_id = this.currentView.id
      this.chatMetadata.sub_topic_name = this.currentView.content.subtopic_name
      this.chatMetadata.exam_id = null
      this.chatMetadata.exercise_id = null
      this.chatMetadata.question_id = null
    } else if (this.currentView.type === 'exercise') {
      const topicData = this.getTopicDataFromExercise()
      this.chatMetadata.topic_id = topicData.topic_id
      this.chatMetadata.topic_name = topicData.topic_name
      this.chatMetadata.sub_topic_id = null
      this.chatMetadata.sub_topic_name = null
      this.chatMetadata.exam_id = null
      this.chatMetadata.exercise_id = this.currentView.id
      this.chatMetadata.question_id = question_event.id
    } else if (this.currentView.type === 'exam') {
      this.chatMetadata.topic_id = null
      this.chatMetadata.topic_name = null
      this.chatMetadata.sub_topic_id = null
      this.chatMetadata.sub_topic_name = null
      this.chatMetadata.exam_id = this.currentView.id
      this.chatMetadata.exercise_id = null
      this.chatMetadata.question_id = question_event.id
    }
  }

  toggleChatPopup() {
    this.chatOpen = !this.chatOpen
    console.log("chat toggled")
  }
}
