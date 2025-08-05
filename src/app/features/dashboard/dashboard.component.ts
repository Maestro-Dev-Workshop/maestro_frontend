import { Component, OnInit, inject } from '@angular/core';
import { Router }                    from '@angular/router';
import { CommonModule }              from '@angular/common';
import { SubjectService, Subject }  from '../../core/subject/subject.service';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  subjects: Subject[] = [];
  private subjSvc = inject(SubjectService);
  private router  = inject(Router);

  ngOnInit() {
    this.subjSvc.getSubjects().subscribe(list => this.subjects = list);
  }

  goNew() {
    this.router.navigate(['/subject/new']);
  }

  open(sub: Subject) {
    this.router.navigate([`/subject/${sub.id}/lessons`]);
  }
}