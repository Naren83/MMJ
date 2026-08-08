import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'warning' | 'danger' | 'info';

export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  timestamp: Date;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _toasts = signal<ToastNotification[]>([]);

  readonly toasts = this._toasts.asReadonly();

  show(title: string, message: string, type: ToastType = 'info', duration: number = 4000): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const toast: ToastNotification = { id, type, title, message, timestamp: new Date(), duration };

    this._toasts.update(toasts => [toast, ...toasts]);

    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }
  }

  showSuccess(title: string, message: string): void {
    this.show(title, message, 'success');
  }

  showWarning(title: string, message: string): void {
    this.show(title, message, 'warning', 5000);
  }

  showDanger(title: string, message: string): void {
    this.show(title, message, 'danger', 6000);
  }

  showInfo(title: string, message: string): void {
    this.show(title, message, 'info');
  }

  dismiss(id: string): void {
    this._toasts.update(toasts => toasts.filter(t => t.id !== id));
  }
}
