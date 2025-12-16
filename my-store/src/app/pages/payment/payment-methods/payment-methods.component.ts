import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../../../core/services/payment.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.component.html',
  styleUrls: ['./payment-methods.component.scss']
})
export class PaymentMethodsPage implements OnInit {
  methods: any[] = [];
  loading = true;
  showAddMethodModal = false;
  lastUpdated = new Date();

  constructor(
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadMethods();
  }

  loadMethods() {
    this.loading = true;
    this.paymentService.getPaymentMethods().subscribe({
      next: (data: any[]) => {
        this.methods = data;
        this.loading = false;
        this.lastUpdated = new Date();
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.notificationService.showError('Failed to load payment methods');
        this.loading = false;
      }
    });
  }

  getMethodIcon(type: string): string {
    const icons: any = {
      'card': 'fa-credit-card',
      'paypal': 'fa-paypal',
      'applepay': 'fa-apple',
      'googlepay': 'fa-google',
      'bank': 'fa-university'
    };
    return icons[type] || 'fa-credit-card';
  }

  getMethodColor(type: string): string {
    const colors: any = {
      'card': '#0d6efd',
      'paypal': '#003087',
      'applepay': '#000000',
      'googlepay': '#4285F4',
      'bank': '#198754'
    };
    return colors[type] || '#6c757d';
  }

  getMethodDisplayName(type: string): string {
    const names: any = {
      'card': 'Credit/Debit Card',
      'paypal': 'PayPal',
      'applepay': 'Apple Pay',
      'googlepay': 'Google Pay',
      'bank': 'Bank Account'
    };
    return names[type] || 'Payment Method';
  }

  getDefaultMethod() {
    return this.methods.find(m => m.isDefault);
  }

  setDefault(methodId: string) {
    this.paymentService.setDefaultPaymentMethod(methodId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Default payment method updated');
        this.loadMethods();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to update default method');
      }
    });
  }

  deleteMethod(methodId: string) {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    this.paymentService.deletePaymentMethod(methodId).subscribe({
      next: () => {
        this.notificationService.showSuccess('Payment method deleted');
        this.loadMethods();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to delete payment method');
      }
    });
  }

  editMethod(method: any) {
    this.notificationService.showInfo('Edit functionality coming soon');

  }

  saveNewMethod() {

    this.notificationService.showSuccess('Payment method added successfully');
    this.showAddMethodModal = false;
    this.loadMethods();
  }

  contactSupport() {
    this.notificationService.showInfo('Redirecting to support...');
  }
}