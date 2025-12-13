import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsPage implements OnInit {
  notifications: any[] = [];
  filteredNotifications: any[] = [];
  loading = true;
  filter = 'all';
  typeFilter = '';
  unreadCount = 0;
  lastUpdated = new Date();

  notificationTypes = [
    { value: 'success', label: 'Success', icon: 'fa-check-circle', color: '#198754' },
    { value: 'info', label: 'Info', icon: 'fa-info-circle', color: '#0dcaf0' },
    { value: 'warning', label: 'Warning', icon: 'fa-exclamation-triangle', color: '#ffc107' },
    { value: 'error', label: 'Error', icon: 'fa-times-circle', color: '#dc3545' }
  ];

  constructor(
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading = true;
    this.notificationService.getNotifications().subscribe({
      next: (data: any[]) => {
        this.notifications = data;
        this.filterNotifications();
        this.calculateUnreadCount();
        this.loading = false;
        this.lastUpdated = new Date();
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  filterNotifications() {
    let filtered = [...this.notifications];
    
    // Filter by read status
    if (this.filter === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }
    
    // Filter by type
    if (this.typeFilter) {
      filtered = filtered.filter(n => n.type === this.typeFilter);
    }
    
    this.filteredNotifications = filtered;
  }

  calculateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.read).length;
  }

  setFilter(filter: string) {
    this.filter = filter;
    this.filterNotifications();
  }

  setTypeFilter(type: string) {
    this.typeFilter = type === this.typeFilter ? '' : type;
    this.filterNotifications();
  }

  markAsRead(notificationId: string) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.read = true;
          this.filterNotifications();
          this.calculateUnreadCount();
        }
      }
    });
  }

  markAllAsRead() {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.forEach(n => n.read = true);
        this.filterNotifications();
        this.calculateUnreadCount();
        this.notificationService.showSuccess('All notifications marked as read');
      }
    });
  }

  deleteNotification(notificationId: string) {
    this.notificationService.deleteNotification(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.filterNotifications();
        this.calculateUnreadCount();
        this.notificationService.showSuccess('Notification deleted');
      }
    });
  }

  clearAll() {
    if (!confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    this.notificationService.clearAll().subscribe({
      next: () => {
        this.notifications = [];
        this.filteredNotifications = [];
        this.unreadCount = 0;
        this.notificationService.showSuccess('All notifications cleared');
      }
    });
  }

  performAction(notification: any) {
    if (!notification.action) return;
    
    this.markAsRead(notification.id);
    
    switch (notification.action.type) {
      case 'track_order':
        this.router.navigate(['/track-order', notification.action.orderId]);
        break;
      case 'product':
        this.router.navigate(['/products', notification.action.productId]);
        break;
      case 'sale':
        this.router.navigate(['/products'], { 
          queryParams: { category: notification.action.category }
        });
        break;
      case 'promo_code':
        this.notificationService.showInfo(`Use promo code: ${notification.action.code}`);
        break;
      default:
        // Do nothing
        break;
    }
  }

  getTypeColor(type: string): string {
    const colors: any = {
      'success': '#198754',
      'info': '#0dcaf0',
      'warning': '#ffc107',
      'error': '#dc3545'
    };
    return colors[type] || '#6c757d';
  }

  getTypeIcon(type: string): string {
    const icons: any = {
      'success': 'fa-check-circle',
      'info': 'fa-info-circle',
      'warning': 'fa-exclamation-triangle',
      'error': 'fa-times-circle'
    };
    return icons[type] || 'fa-bell';
  }

  getActionButtonClass(actionType: string): string {
    const classes: any = {
      'track_order': 'primary',
      'product': 'success',
      'sale': 'warning',
      'promo_code': 'info'
    };
    return classes[actionType] || 'secondary';
  }

  getActionIcon(actionType: string): string {
    const icons: any = {
      'track_order': 'fa-truck',
      'product': 'fa-box',
      'sale': 'fa-tag',
      'promo_code': 'fa-ticket-alt'
    };
    return icons[actionType] || 'fa-external-link-alt';
  }

  getActionLabel(actionType: string): string {
    const labels: any = {
      'track_order': 'Track Order',
      'product': 'View Product',
      'sale': 'View Sale',
      'promo_code': 'Use Code'
    };
    return labels[actionType] || 'View Details';
  }
}