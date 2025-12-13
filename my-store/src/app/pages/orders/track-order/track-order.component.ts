import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrls: ['./track-order.component.scss']
})
export class TrackOrderPage implements OnInit, OnDestroy {
  orderId: string = '';
  orderNumber: string = '';
  tracking: any = null;
  loading = true;
  error = false;
  
  // Live tracking simulation
  liveUpdates = true;
  updateInterval: any;
  
  // Map simulation (يمكن استبداله بخدمة خرائط حقيقية)
  showMap = false;
  mapLocation = {
    lat: 40.7128,
    lng: -74.0060,
    zoom: 12
  };
  
  // Delivery person simulation
  deliveryPerson = {
    name: 'John Driver',
    phone: '+1 (555) 123-4567',
    rating: 4.8,
    photo: 'assets/images/driver-placeholder.jpg'
  };
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id') || '';
    if (this.orderId) {
      this.loadTracking();
      this.startLiveUpdates();
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopLiveUpdates();
  }

  loadTracking() {
    this.loading = true;
    this.error = false;
    
    this.orderService.trackOrder(this.orderId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: any) => {
          this.tracking = data;
          this.orderNumber = data.orderNumber;
          this.loading = false;
          
          // Update delivery person info if available
          if (data.deliveryPerson) {
            this.deliveryPerson = { ...this.deliveryPerson, ...data.deliveryPerson };
          }
          
          // Update map location if available
          if (data.currentLocation) {
            this.mapLocation = {
              lat: data.currentLocation.lat || this.mapLocation.lat,
              lng: data.currentLocation.lng || this.mapLocation.lng,
              zoom: 14
            };
          }
        },
        error: (error: any) => {
          console.error('Error loading tracking:', error);
          this.error = true;
          this.loading = false;
          this.notificationService.showError('Failed to load tracking information');
        }
      });
  }

  // Live tracking simulation
  startLiveUpdates() {
    if (this.liveUpdates) {
      this.updateInterval = setInterval(() => {
        this.simulateLiveUpdate();
      }, 30000); // Update every 30 seconds
    }
  }

  stopLiveUpdates() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }

  simulateLiveUpdate() {
    if (!this.tracking || this.tracking.status === 'delivered' || this.tracking.status === 'cancelled') {
      return;
    }
    
    // Simulate location updates
    if (this.tracking.status === 'shipped') {
      // Move location slightly
      this.mapLocation.lat += 0.001;
      this.mapLocation.lng += 0.001;
      
      // Add tracking event
      if (this.tracking.events && this.tracking.events.length > 0) {
        const lastEvent = this.tracking.events[0];
        const newEvent = {
          ...lastEvent,
          id: Date.now(),
          date: new Date().toISOString(),
          location: `${(this.mapLocation.lat).toFixed(4)}, ${(this.mapLocation.lng).toFixed(4)}`,
          description: 'In transit - package moving to next facility'
        };
        
        this.tracking.events.unshift(newEvent);
        
        // Keep only last 10 events
        if (this.tracking.events.length > 10) {
          this.tracking.events = this.tracking.events.slice(0, 10);
        }
      }
    }
  }

  toggleLiveUpdates() {
    this.liveUpdates = !this.liveUpdates;
    
    if (this.liveUpdates) {
      this.startLiveUpdates();
      this.notificationService.showSuccess('Live tracking enabled');
    } else {
      this.stopLiveUpdates();
      this.notificationService.showInfo('Live tracking disabled');
    }
  }

  toggleMap() {
    this.showMap = !this.showMap;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'warning',
      'processing': 'info',
      'shipped': 'primary',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'pending': 'fas fa-clock',
      'processing': 'fas fa-cog fa-spin',
      'shipped': 'fas fa-shipping-fast',
      'delivered': 'fas fa-check-circle',
      'cancelled': 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-question-circle';
  }

  copyTrackingNumber() {
    if (!this.tracking?.trackingNumber) return;
    
    navigator.clipboard.writeText(this.tracking.trackingNumber)
      .then(() => {
        this.notificationService.showSuccess('Tracking number copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        this.notificationService.showError('Failed to copy tracking number');
      });
  }

  shareTracking() {
    const shareData = {
      title: `Track Order #${this.orderNumber}`,
      text: `Track my order #${this.orderNumber}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
      this.copyTrackingNumber();
    }
  }

  contactSupport() {
    this.router.navigate(['/contact'], {
      queryParams: { 
        orderId: this.orderId,
        orderNumber: this.orderNumber,
        type: 'tracking'
      }
    });
  }

  viewOrderDetails() {
    this.router.navigate(['/orders', this.orderId]);
  }

  downloadInvoice() {
    this.orderService.downloadInvoice(this.orderId).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${this.orderNumber || this.orderId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.notificationService.showSuccess('Invoice downloaded successfully');
      },
      error: (error) => {
        console.error('Error downloading invoice:', error);
        this.notificationService.showError('Failed to download invoice');
      }
    });
  }

  contactDriver() {
    if (this.deliveryPerson.phone) {
      window.open(`tel:${this.deliveryPerson.phone}`, '_blank');
    }
  }

  getEstimatedTime(): string {
    if (!this.tracking?.estimatedDelivery) return 'N/A';
    
    const estimated = new Date(this.tracking.estimatedDelivery);
    const now = new Date();
    const diffHours = Math.ceil((estimated.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours <= 0) {
      return 'Arriving today';
    } else if (diffHours < 24) {
      return `Arriving in ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `Arriving in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    }
  }

  getProgressPercentage(): number {
    const statusProgress: any = {
      'pending': 10,
      'processing': 30,
      'shipped': 60,
      'out_for_delivery': 80,
      'delivered': 100,
      'cancelled': 0
    };
    
    return statusProgress[this.tracking?.status] || 0;
  }

  // Check if order is trackable
  isTrackable(): boolean {
    return this.tracking && 
           ['processing', 'shipped', 'out_for_delivery'].includes(this.tracking.status);
  }

  // Navigate back
  goBack() {
    this.router.navigate(['/orders']);
  }

  // Refresh tracking
  refreshTracking() {
    this.loadTracking();
    this.notificationService.showInfo('Refreshing tracking information...');
  }
}