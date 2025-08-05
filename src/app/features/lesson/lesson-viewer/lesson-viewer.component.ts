import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router }    from '@angular/router';
import { CommonModule }              from '@angular/common';
import { LessonService, Lesson }    from '../../../core/lesson/lesson.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-lesson-viewer',
  templateUrl: './lesson-viewer.component.html'
})
export class LessonViewerComponent implements OnInit {
  lessons: Lesson[] = [];
  private lessonSvc = inject(LessonService);
  private route     = inject(ActivatedRoute);
  private router    = inject(Router);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.lessonSvc.getLessons(id).subscribe(list => this.lessons = list);
  }

  goExercises() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate([`/subject/${id}/exercises`]);
  }

  goExams() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate([`/subject/${id}/exams`]);
  }
}