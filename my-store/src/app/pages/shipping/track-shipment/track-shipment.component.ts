import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ShippingService } from '../../../core/services/shipping.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-track-shipment',
  templateUrl: './track-shipment.component.html',
  styleUrls: ['./track-shipment.component.scss']
})
export class TrackShipmentPage implements OnInit {
  trackingNumber: string = '';
  shipment: any = null;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private shippingService: ShippingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.trackingNumber = this.route.snapshot.paramMap.get('id') || '';
    
    if (this.trackingNumber) {
      this.trackShipment();
    }
  }

  trackShipment() {
    if (!this.trackingNumber.trim()) {
      this.notificationService.showError('Please enter a tracking number');
      return;
    }

    this.loading = true;
    this.shippingService.trackShipment(this.trackingNumber).subscribe({
      next: (data: any) => {
        this.shipment = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.notificationService.showError('Failed to track shipment');
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'pending': 'secondary',
      'processing': 'info',
      'shipped': 'primary',
      'out_for_delivery': 'warning',
      'delivered': 'success',
      'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
  }

  getStatusIcon(status: string): string {
    const icons: any = {
      'pending': 'fa-clock',
      'processing': 'fa-cog',
      'shipped': 'fa-truck',
      'out_for_delivery': 'fa-truck-loading',
      'delivered': 'fa-check-circle',
      'cancelled': 'fa-times-circle'
    };
    return icons[status] || 'fa-info-circle';
  }

  contactCarrier() {
    if (!this.shipment) return;
    
    const carrierInfo: any = {
      'UPS': '1-800-742-5877',
      'FedEx': '1-800-463-3339',
      'USPS': '1-800-275-8777',
      'DHL': '1-800-225-5345'
    };
    
    const phone = carrierInfo[this.shipment.carrier] || '1-800-123-4567';
    alert(`Call ${this.shipment.carrier} at ${phone}`);
  }

  contactSupport() {
    this.notificationService.showInfo('Redirecting to support...');
    // In a real app, navigate to support page
  }

  downloadLabel() {
    this.notificationService.showInfo('Downloading shipping label...');
    // In a real app, trigger file download
  }
}