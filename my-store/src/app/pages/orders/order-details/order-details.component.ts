import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { CartService } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { 
  Order, 
  OrderItem, 
  ShippingAddress, 
  PaymentInfo 
} from '../../../core/models/model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading: boolean = true;
  error: string = '';
  orderId: string = '';
  
  // Tabs
  activeTab: string = 'items';
  
  // Tracking
  trackingSteps: any[] = [];
  currentTrackingStep: number = 0;
  
  // UI states
  showShippingDetails: boolean = true;
  showPaymentDetails: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id') || '';
      if (this.orderId) {
        this.loadOrderDetails();
      }
    });
  }

  loadOrderDetails(): void {
    this.loading = true;
    this.error = '';
    
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
        
        if (!order) {
          this.error = 'Order not found';
          this.notificationService.showError('Order not found');
        } else {
          this.updateTrackingStatus(order.status);
        }
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.error = 'Failed to load order details';
        this.loading = false;
        this.notificationService.showError('Failed to load order details');
      }
    });
  }

  updateTrackingStatus(status: string): void {
    // Setup tracking steps
    this.trackingSteps = [
      { step: 1, title: 'Order Placed', icon: 'fas fa-shopping-cart', completed: true },
      { step: 2, title: 'Processing', icon: 'fas fa-cog', completed: false },
      { step: 3, title: 'Shipped', icon: 'fas fa-shipping-fast', completed: false },
      { step: 4, title: 'Out for Delivery', icon: 'fas fa-truck', completed: false },
      { step: 5, title: 'Delivered', icon: 'fas fa-home', completed: false }
    ];

    // Update based on status
    const statusMap: { [key: string]: number } = {
      'pending': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 5,
      'cancelled': 0
    };

    this.currentTrackingStep = statusMap[status] || 0;
    
    // Mark steps as completed
    this.trackingSteps.forEach((step, index) => {
      step.completed = index < this.currentTrackingStep;
    });
  }

  // Helper methods
  getStatusClass(status: string): string {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'processing': return 'bg-info text-white';
      case 'shipped': return 'bg-primary text-white';
      case 'delivered': return 'bg-success text-white';
      case 'cancelled': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'pending': 'Pending',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  }

  // Calculation methods
  calculateSubtotal(): number {
    if (!this.order || !this.order.items) return 0;
    return this.order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  calculateTotal(): number {
    if (!this.order) return 0;
    // Use order.total if it exists, otherwise calculate it
    if (this.order.total && this.order.total > 0) {
      return this.order.total;
    }
    
    // Fallback calculation
    const subtotal = this.calculateSubtotal();
    const shipping = this.order.shipping || 0;
    const tax = this.order.tax || 0;
    const discount = this.order.discount || 0;
    return subtotal + shipping + tax - discount;
  }

  // Navigation methods
  goToTrackOrder(): void {
    if (this.orderId) {
      this.router.navigate(['/track-order', this.orderId]);
    }
  }

  goBackToOrders(): void {
    this.router.navigate(['/orders']);
  }

  // Actions
  printInvoice(): void {
    window.print();
  }

  trackOrder(): void {
    this.goToTrackOrder();
  }

  reorder(): void {
    if (this.order) {
      this.orderService.reorder(this.order.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.showSuccess('Items added to cart!');
            this.router.navigate(['/cart']);
          } else {
            this.notificationService.showError(response.message || 'Failed to reorder');
          }
        },
        error: (error) => {
          console.error('Error reordering:', error);
          this.notificationService.showError('Failed to reorder items');
        }
      });
    }
  }

  reorderItem(item: OrderItem): void {
    if (!item.product) {
      this.notificationService.showError('Product information is missing');
      return;
    }

    this.cartService.addToCart(item.product, item.quantity).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.notificationService.showSuccess(`${item.product?.name || 'Item'} added to cart`);
        }
      },
      error: (error) => {
        this.notificationService.showError('Failed to add item to cart');
      }
    });
  }

  downloadInvoice(): void {
    if (this.orderId) {
      this.orderService.downloadInvoice(this.orderId).subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `invoice-${this.order?.orderNumber || this.orderId}.pdf`;
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
  }

  contactSupport(): void {
    this.router.navigate(['/contact'], {
      queryParams: { 
        orderId: this.orderId,
        orderNumber: this.order?.orderNumber 
      }
    });
  }

  cancelOrder(): void {
    if (this.order && confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.order.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.notificationService.showSuccess('Order cancelled successfully');
            this.loadOrderDetails(); // Reload to update status
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          this.notificationService.showError('Failed to cancel order');
        }
      });
    }
  }

  // Tab switching
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // UI toggles
  toggleShippingDetails(): void {
    this.showShippingDetails = !this.showShippingDetails;
  }

  togglePaymentDetails(): void {
    this.showPaymentDetails = !this.showPaymentDetails;
  }

  // Format date
  formatDate(date?: string | Date): string {
    if (!date) return 'N/A';
    
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }
      
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'N/A';
    }
  }

  // Helper methods for safe property access
  getOrderDate(): string {
    if (this.order) {
      return this.formatDate(this.order.date || this.order.createdAt);
    }
    return 'N/A';
  }

  getOrderUpdatedDate(): string {
    if (this.order?.updatedAt) {
      return this.formatDate(this.order.updatedAt);
    }
    return 'N/A';
  }

  getDeliveryInfo(): any {
    if (this.order?.delivery) {
      return {
        estimatedDate: this.formatDate(this.order.delivery.estimatedDate),
        deliveredAt: this.formatDate(this.order.delivery.deliveredAt),
        carrier: this.order.delivery.carrier || 'Not specified',
        trackingNumber: this.order.delivery.trackingNumber || 'Not available'
      };
    }
    return null;
  }

  getShippingAddress(): ShippingAddress | null {
    return this.order?.shippingAddress || null;
  }

  getPaymentInfo(): PaymentInfo | null {
    return this.order?.payment || null;
  }
}