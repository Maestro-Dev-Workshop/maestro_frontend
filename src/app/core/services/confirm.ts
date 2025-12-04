import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message?: string;
  okText?: string;
  cancelText?: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmationSubject = new Subject<{
    options: ConfirmOptions,
    response: Subject<boolean>
  }>();

  confirmation$ = this.confirmationSubject.asObservable();

  open(options: ConfirmOptions) {
    const response$ = new Subject<boolean>();
    this.confirmationSubject.next({ options, response: response$ });
    return response$.asObservable();
  }
}
