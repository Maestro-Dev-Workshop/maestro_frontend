import { Component } from '@angular/core';
import { Header } from '../../../shared/components/header/header';
import { Router } from '@angular/router';
import { CreationStepTab } from '../creation-step-tab/creation-step-tab';

@Component({
  selector: 'app-naming-upload',
  imports: [Header, CreationStepTab],
  templateUrl: './naming-upload.html',
  styleUrl: './naming-upload.css'
})
export class NamingUpload {
  
}
