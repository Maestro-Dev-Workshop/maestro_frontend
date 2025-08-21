import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SubjectModel } from '../../../core/models/subject-model';

@Component({
  selector: 'app-subjects',
  imports: [Header, RouterLink, CommonModule],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class Subjects {
  subjects: SubjectModel[] = [
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Mathematics",
      "createdAt": new Date("2023-10-01T12:00:00Z"),
      "status": "In Progress",
      "completion": 30,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Science",
      "createdAt": new Date("2023-10-01T12:00:00Z"),
      "status": "Completed",
      "completion": 100,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "History",
      "createdAt": new Date("2023-10-01T12:00:00Z"),
      "status": "Not Started",
      "completion": 0,
    },
    {
      "id": "sj2nd-2dkap-uamds",
      "name": "Literature",
      "createdAt": new Date("2023-10-01T12:00:00Z"),
      "status": "In Progress",
      "completion": 50,
    }
  ];
}
