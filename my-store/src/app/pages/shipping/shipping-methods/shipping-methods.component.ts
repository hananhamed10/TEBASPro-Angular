import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ShippingService } from '../../../core/services/shipping.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-shipping-methods',
  templateUrl: './shipping-methods.component.html',
  styleUrls: ['./shipping-methods.component.scss']
})
export class ShippingMethodsPage implements OnInit {
  methods: any[] = [];
  selectedMethod: string = '';
  selectedAddress: any = null;
  loading = true;
  
  orderSummary = {
    subtotal: 0,
    tax: 0
  };

  constructor(
    private shippingService: ShippingService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadShippingMethods();
    this.loadOrderSummary();
    this.loadSelectedAddress();
  }

  loadShippingMethods() {
    this.loading = true;
    this.shippingService.getShippingMethods().subscribe({
      next: (data: any[]) => {
        this.methods = data;
        if (data.length > 0) {
          this.selectedMethod = data[0].id;
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  loadOrderSummary() {
    this.cartService.cartItems$.subscribe((cartItems: any[]) => {
      // ✅ تصحيح: استخدمي cartItems بدلاً من cart
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
      
      this.orderSummary = {
        subtotal: subtotal,
        tax: subtotal * 0.08
      };
    });
  }

  loadSelectedAddress() {
    this.shippingService.getShippingAddresses().subscribe({
      next: (addresses: any[]) => {
        this.selectedAddress = addresses.find(addr => addr.isDefault) || 
                              (addresses.length > 0 ? addresses[0] : null);
      }
    });
  }

  selectMethod(methodId: string) {
    this.selectedMethod = methodId;
    localStorage.setItem('selectedShippingMethod', methodId);
  }

  getSelectedMethod() {
    return this.methods.find(m => m.id === this.selectedMethod);
  }

  calculateTotal(): number {
    const shippingCost = this.getSelectedMethod()?.price || 0;
    return this.orderSummary.subtotal + shippingCost + this.orderSummary.tax;
  }

  changeAddress() {
    this.router.navigate(['/profile'], { fragment: 'addresses' });
  }

  addAddress() {
    this.router.navigate(['/profile'], { 
      queryParams: { addAddress: true },
      fragment: 'addresses'
    });
  }

  continueToPayment() {
    if (!this.selectedMethod || !this.selectedAddress) {
      alert('Please select shipping method and address');
      return;
    }
    
    const shippingInfo = {
      method: this.getSelectedMethod(),
      address: this.selectedAddress,
      shippingCost: this.getSelectedMethod()?.price || 0
    };
    
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    
    this.router.navigate(['/checkout']);
  }
}