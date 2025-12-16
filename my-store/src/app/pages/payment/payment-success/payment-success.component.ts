import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../core/services/payment.service';
import { OrderService } from '../../../core/services/order.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessPage implements OnInit {

  orderId: string = '';
  orderNumber: string = '';
  transactionId: string = '';
  paymentMethod: string = '';
  expectedDelivery: string = '';
  amount: number = 0;
  customerEmail: string = '';
  
  // Order details
  orderDetails: any = null;
  isLoading: boolean = true;
  
  
  today: Date = new Date();
  
  // Payment method configurations
  paymentMethodsConfig = {
    creditCard: {
      icon: '💳',
      title: 'Payment Successful!',
      message: 'Your payment has been processed successfully.',
      instructions: [
        'You will receive an email confirmation shortly',
        'Order will be processed within 24 hours',
        'You can track your order in "My Orders" section'
      ],
      buttonText: 'View Order Details',
      action: () => this.goToOrderDetails()
    },
    cash: {
      icon: '💰',
      title: 'Order Confirmed!',
      message: 'Your order has been placed successfully.',
      instructions: [
        'Pay when you receive your order',
        'Order will be delivered within 3-5 business days',
        'Our delivery agent will contact you before delivery'
      ],
      buttonText: 'Track Delivery',
      action: () => this.trackOrder()
    },
    vodafoneCash: {
      icon: '📱',
      title: 'Vodafone Cash Payment',
      message: 'Please complete your payment using Vodafone Cash.',
      instructions: [
        'Send payment to: 01012345678',
        'Use order number as payment note',
        'Screenshot payment confirmation',
        'Upload screenshot in order tracking'
      ],
      buttonText: 'View Payment Details',
      action: () => this.showVodafoneDetails()
    },
    instapay: {
      icon: '🏦',
      title: 'Instapay Payment',
      message: 'Please complete your bank transfer.',
      instructions: [
        'Bank: CIB - Account: 1234567890',
        'Use order number as reference',
        'Keep transaction receipt',
        'Upload receipt in order tracking'
      ],
      buttonText: 'View Bank Details',
      action: () => this.showInstapayDetails()
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    
    this.today = new Date();
    
    
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] || '';
      this.orderNumber = params['orderNumber'] || '';
      this.transactionId = params['transactionId'] || '';
      this.paymentMethod = params['paymentMethod'] || 'creditCard';
      this.expectedDelivery = params['expectedDelivery'] || '';
      this.amount = parseFloat(params['amount']) || 0;
      this.customerEmail = params['customerEmail'] || '';
      
      this.loadOrderDetails();
    });
  }

  loadOrderDetails() {
    if (this.orderId) {
     
      this.orderService.getOrderDetails(this.orderId).subscribe({
        next: (order) => {
          this.orderDetails = order;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading order:', error);
          this.loadSampleOrder();
        }
      });
    } else if (this.orderNumber) {
     
      this.orderService.getUserOrders().subscribe(orders => {
        const order = orders.find(o => o.orderNumber === this.orderNumber);
        this.orderDetails = order || this.getSampleOrderDetails();
        this.isLoading = false;
      });
    } else {
      this.loadSampleOrder();
    }
  }

  loadSampleOrder() {
    this.orderDetails = this.getSampleOrderDetails();
    this.isLoading = false;
  }

  
  getPaymentConfig() {
    return this.paymentMethodsConfig[this.paymentMethod as keyof typeof this.paymentMethodsConfig] 
           || this.paymentMethodsConfig.creditCard;
  }

 
  needsPaymentAction(): boolean {
    return ['vodafoneCash', 'instapay'].includes(this.paymentMethod);
  }

  isPaymentCompleted(): boolean {
    return ['creditCard', 'cash'].includes(this.paymentMethod);
  }

 
  goToOrderDetails() {
    if (this.orderId) {
      this.router.navigate(['/orders', this.orderId]);
    } else {
      this.router.navigate(['/orders']);
    }
  }

  trackOrder() {
    if (this.orderId) {
      this.router.navigate(['/track-order', this.orderId]);
    } else {
      this.router.navigate(['/track-order']);
    }
  }

  showVodafoneDetails() {
    this.paymentService.getVodafoneCashDetails().subscribe(details => {
      alert(`Vodafone Cash Number: ${details.vodafoneNumber}\nAccount Name: ${details.accountName}`);
    });
  }

  showInstapayDetails() {
    this.paymentService.getInstapayDetails().subscribe(details => {
      alert(`Bank: ${details.bankName}\nAccount: ${details.accountNumber}`);
    });
  }

  continueShopping() {
    this.router.navigate(['/products']);
  }

  downloadInvoice() {
    console.log('Downloading invoice for order:', this.orderNumber);
    alert('Invoice download started. Check your email for the invoice.');
  }

  shareOrder() {
    const shareText = `I just placed an order #${this.orderNumber} on Your Store!`;
    if (navigator.share) {
      navigator.share({
        title: 'My Order',
        text: shareText,
        url: window.location.href
      });
    } else {
      alert('Share: ' + shareText);
    }
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  openHelpModal() {
    alert('For help, please contact support@example.com or call +20 10 1234 5678');
  }

  private getSampleOrderDetails() {
    return {
      id: this.orderId || 'ORD-' + Date.now(),
      orderNumber: this.orderNumber || 'ORD-' + Math.floor(Math.random() * 10000),
      date: new Date().toISOString(),
      total: this.amount || 99.99,
      paymentMethod: this.paymentMethod,
      status: 'pending',
      items: [
        { product: { name: 'Sample Product 1' }, quantity: 1, price: 49.99 },
        { product: { name: 'Sample Product 2' }, quantity: 2, price: 25.00 }
      ],
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Cairo'
      }
    };
  }

 
  getDisplayDate(): string {
    if (this.orderDetails?.date) {
      return this.formatDate(this.orderDetails.date);
    }
    return this.formatDate(this.today);
  }

  // Helper methods for template
  getItemName(item: any): string {
    return item.product?.name || item.name || 'Product';
  }

  getItemPrice(item: any): number {
    return item.product?.price || item.price || 0;
  }

  getItemTotal(item: any): number {
    const price = this.getItemPrice(item);
    const quantity = item.quantity || 1;
    return price * quantity;
  }

  formatDate(dateInput: string | Date): string {
    if (!dateInput) return 'N/A';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  
  getDisplayTime(): string {
    return this.today.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }


  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  
  hasValidOrderData(): boolean {
    return !!(this.orderId || this.orderNumber);
  }
}