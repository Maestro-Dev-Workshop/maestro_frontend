import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-subjects',
  imports: [Header, RouterLink],
  templateUrl: './subjects.html',
  styleUrl: './subjects.css'
})
export class Subjects {
  subjects = [];
}
