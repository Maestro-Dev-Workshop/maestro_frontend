/**
 * Models for toast notification system.
 */

/**
 * Valid toast notification types.
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification message structure.
 */
export interface ToastMessage {
  msg: string;
  type: ToastType;
}
