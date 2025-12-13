import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-user-navbar',
  templateUrl: './user-nav.component.html',
  styleUrls: ['./user-nav.component.scss']
})
export class UserNavbarComponent implements OnInit {
  userName: string = '';
  userInitials: string = '';
  isLoggedIn: boolean = false;
  cartCount: number = 0;
  
  isDropdownOpen: boolean = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.checkUserLogin();
    this.loadCartCount();
    
   
    this.cartService.cartItems$.subscribe(cartItems => {
      this.updateCartCount(cartItems);
    });
  }

  checkUserLogin() {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    if (this.isLoggedIn) {
      this.userName = this.authService.getUserName();
      this.userInitials = this.authService.getUserInitials();
    }
  }

  loadCartCount() {
    const cart = localStorage.getItem('cart');
    if (cart) {
      const cartItems = JSON.parse(cart);
      this.cartCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
    } else {
      this.cartCount = 0;
    }
  }

  updateCartCount(cartItems: any[]) {
    this.cartCount = cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown() {
    this.isDropdownOpen = false;
  }

  // Navigation methods
  goToDashboard() {
    this.router.navigate(['/dashboard']);
    this.closeDropdown();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
    this.closeDropdown();
  }

  goToOrders() {
    this.router.navigate(['/orders']);
    this.closeDropdown();
  }

  goToWishlist() {
    this.router.navigate(['/wishlist']);
    this.closeDropdown();
  }

  goToCart() {
    this.router.navigate(['/cart']);
    this.closeDropdown();
  }

  goToProducts() {
    this.router.navigate(['/products']);
    this.closeDropdown();
  }

  goToCategories() {
    this.router.navigate(['/categories']);
    this.closeDropdown();
  }

  goToNotifications() {
    this.router.navigate(['/notifications']);
    this.closeDropdown();
  }

  goToPaymentMethods() {
    this.router.navigate(['/payment-methods']);
    this.closeDropdown();
  }

  goToShippingMethods() {
    this.router.navigate(['/shipping-methods']);
    this.closeDropdown();
  }

  goToWriteReview() {
    this.router.navigate(['/write-review']);
    this.closeDropdown();
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userName = '';
    this.userInitials = '';
    this.cartCount = 0;
    this.router.navigate(['/login']);
    this.closeDropdown();
  }
}