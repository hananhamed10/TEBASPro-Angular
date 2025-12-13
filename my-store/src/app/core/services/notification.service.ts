import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private storageKey = 'user_notifications';

  constructor() {}

  getNotifications(): Observable<any[]> {
    const notifications = localStorage.getItem(this.storageKey);
    if (notifications) {
      return of(JSON.parse(notifications));
    }
    
    const sampleNotifications = this.generateSampleNotifications();
    this.saveNotifications(sampleNotifications);
    return of(sampleNotifications);
  }

  markAsRead(notificationId: string): Observable<any> {
    const notifications = this.getNotificationsFromStorage();
    const index = notifications.findIndex(n => n.id === notificationId);
    
    if (index !== -1) {
      notifications[index].read = true;
      notifications[index].readDate = new Date().toISOString();
      this.saveNotifications(notifications);
    }
    
    return of({ success: true });
  }

  markAllAsRead(): Observable<any> {
    const notifications = this.getNotificationsFromStorage();
    
    notifications.forEach(notification => {
      notification.read = true;
      notification.readDate = new Date().toISOString();
    });
    
    this.saveNotifications(notifications);
    return of({ success: true });
  }

  deleteNotification(notificationId: string): Observable<any> {
    const notifications = this.getNotificationsFromStorage();
    const filteredNotifications = notifications.filter(n => n.id !== notificationId);
    this.saveNotifications(filteredNotifications);
    
    return of({ success: true });
  }

  clearAll(): Observable<any> {
    localStorage.removeItem(this.storageKey);
    return of({ success: true });
  }

  // Toast/Alert functions
  showSuccess(message: string): void {
    this.showAlert('success', message);
  }

  showError(message: string): void {
    this.showAlert('error', message);
  }

  showInfo(message: string): void {
    this.showAlert('info', message);
  }

  showWarning(message: string): void {
    this.showAlert('warning', message);
  }

  private showAlert(type: string, message: string): void {
    // Create a simple browser alert for now
    // In a real app, you might use a toast library
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // For demo, show browser alert
    if (type === 'error') {
      alert(`❌ Error: ${message}`);
    } else if (type === 'success') {
      alert(`✅ Success: ${message}`);
    } else if (type === 'warning') {
      alert(`⚠️ Warning: ${message}`);
    } else {
      alert(`ℹ️ Info: ${message}`);
    }
  }

  // Add a new notification
  addNotification(notification: any): void {
    const notifications = this.getNotificationsFromStorage();
    const newNotification = {
      id: 'NOTIF-' + Date.now(),
      ...notification,
      date: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(newNotification);
    this.saveNotifications(notifications);
  }

  private getNotificationsFromStorage(): any[] {
    const notifications = localStorage.getItem(this.storageKey);
    return notifications ? JSON.parse(notifications) : this.generateSampleNotifications();
  }

  private saveNotifications(notifications: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notifications));
  }

  private generateSampleNotifications(): any[] {
    return [
      {
        id: '1',
        title: 'Welcome to Our Store!',
        message: 'Thank you for registering. Get 10% off your first order with code WELCOME10.',
        type: 'success',
        icon: 'check-circle',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        read: true,
        action: { type: 'promo_code', code: 'WELCOME10' }
      },
      {
        id: '2',
        title: 'Order Shipped',
        message: 'Your order #ORD-12345 has been shipped. Track your package here.',
        type: 'info',
        icon: 'truck',
        date: new Date(Date.now() - 86400000).toISOString(),
        read: false,
        action: { type: 'track_order', orderId: 'ORD-12345' }
      },
      {
        id: '3',
        title: 'Special Offer',
        message: 'Flash sale! Get 30% off on electronics today only.',
        type: 'warning',
        icon: 'tag',
        date: new Date().toISOString(),
        read: false,
        action: { type: 'sale', category: 'electronics' }
      },
      {
        id: '4',
        title: 'Payment Successful',
        message: 'Your payment for order #ORD-12346 has been processed successfully.',
        type: 'success',
        icon: 'credit-card',
        date: new Date(Date.now() - 3600000).toISOString(),
        read: true
      },
      {
        id: '5',
        title: 'Product Back in Stock',
        message: 'The wireless headphones you were interested in are back in stock!',
        type: 'info',
        icon: 'bell',
        date: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        action: { type: 'product', productId: 'p1' }
      }
    ];
  }
}