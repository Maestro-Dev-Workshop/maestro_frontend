import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Sidebar } from '../sidebar/sidebar';
import { Chatbot } from '../chatbot/chatbot';
import { Subtopic } from '../subtopic/subtopic';
import { Practice } from "../practice/practice";
import { SubjectsService } from '../../../core/services/subjects.service';
import { LessonService } from '../../../core/services/lesson.service';
import { ChatMetadata } from '../../../core/models/chat-metadata.model';
import { ChatbotService } from '../../../core/services/chatbot.service';
import { forkJoin, map, switchMap } from 'rxjs';
import { ChatMessage } from '../../../core/models/chat-message.model';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-lesson-page',
  imports: [Header, Sidebar, Chatbot, Subtopic, Practice],
  templateUrl: './lesson-page.html',
  styleUrl: './lesson-page.css'
})
export class LessonPage implements OnInit {
  subjectId: string;
  chatMetadata: ChatMetadata = {};
  subjectContent: any = {};
  currentView: any = {
    type: 'subtopic', // 'subtopic', 'exercise', or 'exam'
    id: '', // ID of the current subtopic, exercise question, or exam question
    content: {} // Content to display based on the current view
  }
  chatHistory: ChatMessage[] = [];
  chatOpen = false;
  subjectLoading = true;
  subjectService = inject(SubjectsService)
  lessonService = inject(LessonService)
  chatbotService = inject(ChatbotService)
  notify = inject(NotificationService)

  // subjectContent: any = {
  //   subject_name: 'Geography',
  //   topics: [
  //     {
  //       expanded: false,
  //       id: 't1',
  //       title: 'Intro to Geography',
  //       completed: false,
  //       subtopics: [
  //         {
  //           id: 's1-t1',
  //           title: 'Geography Basics',
  //           content: 'Geography is the study of places and the relationships between people and their environments.',
  //           read: true
  //         },
  //         {
  //           id: 's2-t1',
  //           title: 'World Capitals',
  //           content: 'A capital city is the most important city in a country, often where the government is located.',
  //           read: false
  //         },
  //         {
  //           id: 's3-t1',
  //           title: 'Physical Geography',
  //           content: 'Physical geography focuses on the natural environment, including landforms, climates, and ecosystems.',
  //           read: false
  //         }
  //       ],
  //       exercise: {
  //         id: 'et1',
  //         score: null,
  //         questions: [
  //           {
  //             question_id: 'q1-et1',
  //             question_text: 'What is the capital of France?',
  //             question_type: 'multiple choice',
  //             options: [
  //               { option_id: '1', option_text: 'Paris', is_correct: true, selected: false },
  //               { option_id: '2', option_text: 'London', is_correct: false, selected: false },
  //               { option_id: '3', option_text: 'Berlin', is_correct: false, selected: false },
  //               { option_id: '4', option_text: 'Madrid', is_correct: false, selected: false }
  //             ]
  //           },
  //           {
  //             question_id: 'q2-et1',
  //             question_text: 'Which of these are oceans on earth?',
  //             question_type: 'multiple selection',
  //             options: [
  //               { option_id: '1', option_text: 'Atlantic Ocean', is_correct: true, selected: false },
  //               { option_id: '2', option_text: 'Pacific Ocean', is_correct: true, selected: false },
  //               { option_id: '3', option_text: 'Amazon River', is_correct: false, selected: false },
  //               { option_id: '4', option_text: 'Nile River', is_correct: false, selected: false }
  //             ]
  //           },
  //           {
  //             question_id: 'q3-et1',
  //             question_text: 'Describe the importance of studying geography in understanding global issues.',
  //             question_type: 'essay',
  //           }
  //         ]
  //       }
  //     },
  //     {
  //       expanded: false,
  //       id: 't2',
  //       title: 'Physical Geography',
  //       completed: true,
  //       subtopics: [
  //         {
  //           id: 's1-t2',
  //           title: 'Climate Zones',
  //           content: 'Climate zones are regions of the world with distinct weather patterns and temperatures.',
  //           read: true
  //         },
  //         {
  //           id: 's2-t2',
  //           title: 'Human Geography',
  //           content: 'Human geography studies how humans interact with the environment and how cultures vary across regions.',
  //           read: true
  //         }
  //       ],
  //       exercise: {
  //         id: 'et2',
  //         score: 2,
  //         questions: [
  //           {
  //             question_id: 'q1-et2',
  //             question_text: 'What are the main climate zones of the world?',
  //             question_type: 'multiple selection',
  //             options: [
  //               { option_id: '1', option_text: 'Tropical', is_correct: true, selected: true },
  //               { option_id: '2', option_text: 'Arctic', is_correct: true, selected: true },
  //               { option_id: '3', option_text: 'Desert', is_correct: true, selected: true },
  //               { option_id: '4', option_text: 'Mountainous', is_correct: false, selected: false }
  //             ]
  //           },
  //           {
  //             question_id: 'q2-et2',
  //             question_text: 'Explain how human activities impact the environment.',
  //             question_type: 'essay',
  //             answer: 'Human activities such as deforestation, pollution, and urbanization significantly impact the environment by altering ecosystems, contributing to climate change, and reducing biodiversity.'
  //           }
  //         ]
  //       }
  //     }
  //   ],
  //   exam: {
  //     id: 'e1',
  //     score: null,
  //     questions: [
  //       {
  //         question_id: 'q1-e1',
  //         question_text: 'What is the largest continent on Earth?',
  //         question_type: 'multiple choice',
  //         options: [
  //           { option_id: '1', option_text: 'Asia', is_correct: true, selected: false },
  //           { option_id: '2', option_text: 'Africa', is_correct: false, selected: false },
  //           { option_id: '3', option_text: 'North America', is_correct: false, selected: false },
  //           { option_id: '4', option_text: 'Europe', is_correct: false, selected: false }
  //         ]
  //       },
  //       {
  //         question_id: 'q2-e1',
  //         question_text: 'Describe the water cycle and its significance in geography.',
  //         question_type: 'essay',
  //         answer: null
  //       }
  //     ]
  //   }
  // }
  // chatHistory = [
  //   {
  //     sender: "user",
  //     message: "Hello",
  //     timestamp: ""
  //   },
  //   {
  //     sender: "assistant",
  //     message: "Hi there, how can I help you?",
  //     timestamp: ""
  //   },
  // ]

  constructor(private cdr: ChangeDetectorRef) {
    // Extract subjectId from the route parameters
    const url = window.location.pathname;
    const parts = url.split('/');
    this.subjectId = parts[parts.length - 1]; // Assuming the last part is the subjectId
  }

  ngOnInit(): void {
    // Fetch chat history
    this.chatbotService.getChatHistory(this.subjectId).subscribe({
      next: (response) => {
        this.chatHistory = response.history;
      }, error: (res) => {
        console.error(`Error fetching chat history ${res}`)
        this.notify.showError(res.error.message || "Failed to load chat history. Please try again later.")
      },
    });


    // 1. Fetch all subjects first
    this.subjectService.getAllSubjects().pipe(
      map((res: any) => res.sessions || []), // unwrap sessions array
      map((subjects: any[]) => subjects.find(s => s.id === this.subjectId)), // pick current subject
      switchMap((subject) => {
        if (!subject) throw new Error('Subject not found');
        
        this.subjectContent = {
          subject_name: subject.name,
          topics: [],
          exam: null
        };
  
        // 2. Fetch topics for this subject
        return this.lessonService.getAllTopics(this.subjectId);
      }),
      switchMap((res: any) => {
        const topicsResponse = res.topics || []; // unwrap topics array
  
        // Shape topics
        const topics = topicsResponse.filter((topic: any) => topic.selected).map((topic: any) => ({
          expanded: false,
          id: topic.id,
          title: topic.title,
          completed: topic.completed,
          subtopics: [],
          exercise: null
        }));
        this.subjectContent.topics = topics;
  
        // 3. For each topic fetch subtopics + exercise in parallel
        const topicRequests = topics.map((topic: any) =>
          forkJoin({
            subtopics: this.lessonService.getAllSubtopics(topic.id).pipe(
              map((r: any) => r.subtopics || [])
            ),
            exercise: this.lessonService.getExercise(topic.id).pipe(
              map((r: any) => r.exercise || null)
            )
          }).pipe(
            map((res) => {
              topic.subtopics = res.subtopics;
              topic.exercise = res.exercise;
              console.log(topic.exercise)
              return topic;
            })
          )
        );
  
        return forkJoin(topicRequests); // wait for all topics to finish loading
      }),
      switchMap(() => {
        // 4. Finally fetch exam
        return this.lessonService.getExam(this.subjectId).pipe(
          map((res: any) => {
            this.subjectContent.exam = res.exam || null; // unwrap exam
            return res.exam;
          })
        );
      })
    ).subscribe({
      next: () => {
        // ✅ Everything loaded, now set initial view
        for (let topic of this.subjectContent.topics) {
          if (!topic.completed) {
            const unreadSubtopic = topic.subtopics.find((st: any) => !st.read);
            if (unreadSubtopic) {
              this.updatecurrentView({ id: unreadSubtopic.id, type: 'subtopic' });
              break;
            } else if (topic.exercise && topic.exercise.score === null) {
              this.updatecurrentView({ id: topic.exercise.id, type: 'exercise' });
              break;
            }
          }
        }
  
        // If still nothing, set exam or fallback
        if (!this.currentView.id && this.subjectContent.exam) {
          this.updatecurrentView({ id: this.subjectContent.exam.id, type: 'exam' });
        } else if (!this.currentView.id) {
          const firstTopic = this.subjectContent.topics[0];
          if (firstTopic && firstTopic.subtopics.length > 0) {
            this.updatecurrentView({ id: firstTopic.subtopics[0].id, type: 'subtopic' });
          }
        }
        
        this.subjectLoading = false;
        this.cdr.detectChanges();
      },
      error: (res) => {
        console.error('Failed to initialize subject content:', res);
        this.notify.showError(res.error.message || 'Failed to load lesson content. Please try again later.');
        this.subjectLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
  
  
  //
  updatecurrentView(event: any) {
    let content = null;

    if (event.type === 'subtopic') {
      content = this.subjectContent.topics
        .flatMap((topic: any) => topic.subtopics)
        .find((subtopic: any)=> subtopic.id === event.id) || {};
      // check for completed topic
      } else if (event.type === 'exercise') {
        content = this.subjectContent.topics
        .flatMap((topic: any) => topic.exercise)
        .find((exercise: any) => exercise.id === event.id) || {};
      } else if (event.type === 'exam') {
        content = this.subjectContent.exam
      }
      
    this.currentView = {
      id: event.id,
      type: event.type,
      content: content
    }

    if (event.type === 'subtopic') {
      this.updateChatMetadata();

      // mark subtopic as read
      const topic_id = this.getTopicDataFromSubtopic().id
      this.lessonService.markSubtopicAsRead(topic_id, event.id).subscribe({
        next: () => {
          this.subjectContent.topics
          .find((topic: any) => topic.id == topic_id).subtopics
          .find((subtopic: any) => subtopic.id == event.id)
          .read = true
          this.updateProgress()
          this.checkForTopicCompleteness(topic_id)
        }, error: (res) => {
          console.error(`Failed to mark subtopic as read: ${res}`)
          this.notify.showError(res.error.message || 'Failed to mark subtopic as read.')
        },
      });
    } else if (this.chatOpen && (this.currentView.content.score == null)){
      this.chatOpen = false;
    }
    console.log(this.currentView)
  }

  updateProgress() {
    let total = 0;
    let completed = 0;
  
    // --- Loop through topics ---
    this.subjectContent.topics.forEach((topic: any) => {
      // Count subtopics
      if (topic.subtopics?.length) {
        total += topic.subtopics.length;
        completed += topic.subtopics.filter((st: any) => st.read).length;
      }
  
      // Count exercise (each topic has exactly one exercise object)
      if (topic.exercise) {
        total += 1;
        if (topic.exercise.score !== null && topic.exercise.score !== undefined) {
          completed += 1;
        }
      }
    });
  
    // --- Count exam (only one per subjectContent) ---
    if (this.subjectContent.exam) {
      total += 1;
      if (this.subjectContent.exam.score !== null && this.subjectContent.exam.score !== undefined) {
        completed += 1;
      }
    }
  
    // Calculate percentage
    const fraction = (completed / total)
    this.subjectService.updateSessionProgress(this.subjectId, fraction).subscribe({
      next: () => {
        console.log("Progress updated successfully")
        const percentage = total > 0 ? Math.round(fraction * 100) : 0;
        console.log(`Progress: ${completed}/${total} (${percentage}%)`);
      }, error: (res) => {
        console.error(`Failed to update progress: ${res}`)
        this.notify.showError(res.error.message || 'Failed to update progress.')
      },
    });
  }  
  
  //
  getTopicDataFromSubtopic() {
    const topicData = this.subjectContent.topics.find((topic: any) => topic.subtopics.some((subtopic: any) => subtopic.id === this.currentView.id));
    return { id: topicData?.id, title: topicData?.title};
  }

  //
  getTopicDataFromExercise() {
    const topicData = this.subjectContent.topics.find((topic: any) => topic.exercise && topic.exercise.id === this.currentView.id);
    return { id: topicData?.id, title: topicData?.title};
  }

  //
  checkForTopicCompleteness(topic_id: string) {
    const topic = this.subjectContent.topics.find((t: any) => t.id === topic_id);
  
    if (!topic) return; // no topic found
  
    const allSubtopicsRead = Array.isArray(topic.subtopics) 
      ? topic.subtopics.every((st: any) => st.read) 
      : false;
  
    const hasExerciseScore = topic.exercise
      ? topic.exercise.score !== null
      : true;
  
    topic.completed = allSubtopicsRead && hasExerciseScore;
  }

  // Updates the current view to the previous or next subtopic
  changeSubtopic(event: any) {
    const id = event.id
    const direction = event.direction;

    const topic = this.subjectContent.topics.find((t: any) => t.id === id);
    if (!topic) return;

    const subtopics = topic.subtopics;
    const currentIndex = subtopics.findIndex((s: any) => s.id === this.currentView.id);
    if (currentIndex === -1) return;

    let newIndex = currentIndex + (direction === 'next' ? 1 : -1);
    if (newIndex < 0) newIndex = 0; // Caps previous subtopic at first subtopic
    if (newIndex >= subtopics.length) newIndex = subtopics.length - 1; // Caps next subtopic at last subtopic

    this.updatecurrentView({ id: subtopics[newIndex].id, type: 'subtopic'})
  }

  //
  updateChatMetadata(question_event? : any) {
    if (this.currentView.type === 'subtopic') {
      const topicData = this.getTopicDataFromSubtopic()
      this.chatMetadata.topic_id = topicData.id
      this.chatMetadata.topic_name = topicData.title
      this.chatMetadata.sub_topic_id = this.currentView.id
      this.chatMetadata.sub_topic_name = this.currentView.content.title
      this.chatMetadata.exercise_id = null
      this.chatMetadata.exam_id = null
      this.chatMetadata.question_id = null
    } else if (this.currentView.type === 'exercise') {
      const topicData = this.getTopicDataFromExercise()
      this.chatMetadata.topic_id = topicData.id
      this.chatMetadata.topic_name = topicData.title
      this.chatMetadata.sub_topic_id = null
      this.chatMetadata.sub_topic_name = null
      this.chatMetadata.exercise_id = this.currentView.id
      this.chatMetadata.exam_id = null
      this.chatMetadata.question_id = question_event.id
    } else if (this.currentView.type === 'exam') {
      this.chatMetadata.topic_id = null
      this.chatMetadata.topic_name = null
      this.chatMetadata.sub_topic_id = null
      this.chatMetadata.sub_topic_name = null
      this.chatMetadata.exercise_id = null
      this.chatMetadata.exam_id = this.currentView.id
      this.chatMetadata.question_id = question_event.id
    }
  }

  //
  toggleChatPopup() {
    this.chatOpen = !this.chatOpen
    console.log("chat toggled")
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
