import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NotificationService, ToastNotification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [],
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.scss'
})
export class ToastContainerComponent {
  protected readonly notificationSvc = inject(NotificationService);
  protected readonly toasts = this.notificationSvc.toasts;

  protected dismiss(id: string): void {
    this.notificationSvc.dismiss(id);
  }

  protected trackToast(i: number, t: ToastNotification): string { return t.id; }
}
