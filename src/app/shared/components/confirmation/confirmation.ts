import { ChangeDetectorRef, Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { ConfirmOptions, ConfirmService } from '../../../core/services/confirm';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  imports: [],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.css',
})
export class Confirmation implements OnInit {
  show = false;
  options!: ConfirmOptions;
  response$!: Subject<boolean>;

  constructor(private confirmService: ConfirmService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.confirmService.confirmation$.subscribe(({ options, response }) => {
      this.options = {
        okText: "Yes",
        cancelText: "No",
        title: "Are you sure?",
        message: "Do you want to proceed?",
        ...options
      };
      this.response$ = response;
      this.show = true;
      this.cdr.detectChanges();
    });
  }

  confirm(result: boolean) {
    this.show = false;
    this.response$.next(result);
    this.response$.complete();
  }
}
