import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "./shared/components/toast/toast";
import { Confirmation } from "./shared/components/confirmation/confirmation";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, Confirmation],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('maestro_frontend');
}
