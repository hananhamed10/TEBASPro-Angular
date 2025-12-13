import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { OrderService } from '../../../core/services/order.service';
import { PaymentService } from '../../../core/services/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  totalAmount: number = 0;
  isLoading: boolean = false;
  currentOrderId: string = '';
  currentOrderNumber: string = '';

  paymentMethods = [
    { value: 'creditCard', label: 'Credit / Debit Card', requiresGateway: true },
    { value: 'cash', label: 'Cash on Delivery', requiresGateway: false },
    { value: 'vodafoneCash', label: 'Vodafone Cash', requiresGateway: false },
    { value: 'instapay', label: 'Instapay', requiresGateway: true }
  ];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      paymentMethod: ['creditCard', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.cartItems = this.cartService.getCartItems();
    this.totalAmount = this.cartService.getTotalPrice();
    
    if (this.cartItems.length === 0) {
      this.router.navigate(['/cart']);
    }
  }

  placeOrder(): void {
    // 1. Validate form
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      alert('Please complete all required fields correctly');
      return;
    }

    // 2. Check if cart has items
    if (this.cartItems.length === 0) {
      alert('Your cart is empty!');
      this.router.navigate(['/cart']);
      return;
    }

    this.isLoading = true;

    // 3. Create order object
    const orderData = {
      customerInfo: this.checkoutForm.value,
      paymentMethod: this.checkoutForm.get('paymentMethod')?.value,
      notes: '',
      discount: 0,
      shipping: 0
    };

    // 4. Save order to database
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        if (response.success && response.order) {
          // Store order details for later use
          this.currentOrderId = response.order.id;
          this.currentOrderNumber = response.order.orderNumber;

          // 5. Process payment
          this.processPaymentAndRedirect(
            response.order.id, 
            response.order.orderNumber, 
            this.checkoutForm.get('paymentMethod')?.value
          );
        } else {
          this.isLoading = false;
          alert(response.message || 'Error creating order');
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error:', error);
        alert('Failed to create order. Please try again.');
      }
    });
  }

  private processPaymentAndRedirect(orderId: string, orderNumber: string, paymentMethod: string): void {
    const paymentData = {
      orderId: orderId,
      orderNumber: orderNumber,
      amount: this.totalAmount,
      customerEmail: this.checkoutForm.get('email')?.value,
      transactionDetails: {
        customerName: `${this.checkoutForm.get('firstName')?.value} ${this.checkoutForm.get('lastName')?.value}`,
        phone: this.checkoutForm.get('phone')?.value
      }
    };

    if (paymentMethod === 'cash') {
      this.paymentService.processCashPayment(paymentData).subscribe({
        next: (paymentResponse) => {
          this.handlePaymentResponse(paymentResponse, orderId, orderNumber, paymentMethod);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Payment error:', error);
          alert('Payment processing failed. Please try again.');
        }
      });
    } else {
      this.paymentService.processPayment(paymentData, paymentMethod).subscribe({
        next: (paymentResponse) => {
          this.handlePaymentResponse(paymentResponse, orderId, orderNumber, paymentMethod);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Payment error:', error);
          alert('Payment processing failed. Please try again.');
        }
      });
    }
  }

  private handlePaymentResponse(
    paymentResponse: any, 
    orderId: string, 
    orderNumber: string, 
    paymentMethod: string
  ): void {
    this.isLoading = false;

    if (paymentResponse.success) {
      // 1. Update payment status in OrderService
      this.orderService.updateOrderPaymentStatus(
        orderId, 
        'paid', 
        paymentResponse.transactionId
      ).subscribe({
        next: () => {
          // 2. Clear cart after payment confirmation
          this.cartService.clearCart();
          
          // 3. Redirect to single payment-success page
          this.router.navigate(['/payment-success'], {
            queryParams: { 
              orderId: orderId,
              orderNumber: orderNumber,
              transactionId: paymentResponse.transactionId,
              paymentMethod: paymentMethod,
              expectedDelivery: paymentResponse.expectedDelivery,
              amount: this.totalAmount,
              customerEmail: this.checkoutForm.get('email')?.value
            }
          });
        },
        error: (error) => {
          console.error('Error updating payment status:', error);
          // Still redirect but show warning
          alert('Payment was successful but there was an issue updating your order status.');
          this.router.navigate(['/payment-success'], {
            queryParams: { 
              orderId: orderId,
              orderNumber: orderNumber,
              transactionId: paymentResponse.transactionId
            }
          });
        }
      });
    } else {
      // Payment failed
      alert(`Payment failed: ${paymentResponse.message}`);
      
      // Update order status to payment failed
      this.orderService.updateOrderPaymentStatus(orderId, 'failed').subscribe({
        next: () => {
          this.router.navigate(['/payment-failed'], {
            queryParams: { 
              orderId: orderId,
              error: paymentResponse.message,
              paymentMethod: paymentMethod
            }
          });
        },
        error: (error) => {
          console.error('Error updating failed payment status:', error);
          this.router.navigate(['/payment-failed'], {
            queryParams: { 
              orderId: orderId,
              error: paymentResponse.message
            }
          });
        }
      });
    }
  }

  getPaymentMethodDescription(value: string): string {
    switch(value) {
      case 'creditCard':
        return 'Secure online payment using your credit or debit card';
      case 'cash':
        return 'Pay when you receive your order. No extra fees.';
      case 'vodafoneCash':
        return 'Pay using Vodafone Cash. We\'ll send you payment details.';
      case 'instapay':
        return 'Bank transfer using Instapay. Fast and secure.';
      default:
        return 'Select a payment method';
    }
  }

  getPaymentMethodLabel(value: string): string {
    const method = this.paymentMethods.find(m => m.value === value);
    return method ? method.label : 'Not specified';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  cancelOrderProcess(): void {
    if (this.currentOrderId && confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(this.currentOrderId).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Order cancelled successfully');
            this.router.navigate(['/cart']);
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. Please try again.');
        }
      });
    }
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}