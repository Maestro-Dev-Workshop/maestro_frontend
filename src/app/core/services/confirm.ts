import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

/**
 * Options for the confirmation dialog.
 */
export interface ConfirmOptions {
  /** Dialog title */
  title?: string;
  /** Dialog message/body text */
  message?: string;
  /** Text for the confirm button */
  okText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Optional data to pass to the dialog */
  data?: Record<string, unknown>;
}

/**
 * Service for displaying confirmation dialogs.
 * Uses a Subject-based approach to communicate between the service and the dialog component.
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private confirmationSubject = new Subject<{
    options: ConfirmOptions;
    response: Subject<boolean>;
  }>();

  /** Observable that emits when a confirmation dialog should be shown */
  confirmation$ = this.confirmationSubject.asObservable();

  /**
   * Opens a confirmation dialog with the specified options.
   * @param options - Configuration options for the dialog
   * @returns Observable that emits true if confirmed, false if cancelled
   */
  open(options: ConfirmOptions): Observable<boolean> {
    const response$ = new Subject<boolean>();
    this.confirmationSubject.next({ options, response: response$ });
    return response$.asObservable();
  }
}
