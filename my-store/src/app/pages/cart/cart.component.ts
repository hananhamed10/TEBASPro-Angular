import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService, CartResponse } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartItem, Product } from '../../core/models/model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartItem[] = [];
  subtotal = 0;
  shipping = 0;
  tax = 0;
  total = 0;
  isAuthenticated = false;
  isLoading = false;
  private cartSubscription!: Subscription;
  
  cartCount: number = 0;
  private cartCountSubscription!: Subscription;

  constructor(
    private router: Router,
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
    this.isLoading = true;
    
    console.log('🛒 Cart Component Initialized');
    
    this.cartSubscription = this.cartService.cartItems$.subscribe({
      next: (items: CartItem[]) => {
        console.log('📦 Cart items updated in component:', items.length);
        this.cartItems = items || [];
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Error loading cart:', error);
        this.isLoading = false;
        this.notificationService.showError('Failed to load cart contents');
      }
    });
    
    this.cartCountSubscription = this.cartService.cartCount$.subscribe({
      next: (count: number) => {
        this.cartCount = count;
        console.log('🔢 Cart count in component:', count);
      },
      error: (error: any) => {
        console.error('❌ Error in cart count subscription:', error);
      }
    });
    
    window.addEventListener('cartUpdated', (event: any) => {
      console.log('📢 External cart update event received:', event.detail);
      this.forceCartReload();
    });
    
    this.checkLocalStorage();
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
    if (this.cartCountSubscription) {
      this.cartCountSubscription.unsubscribe();
    }
  }

  private checkLocalStorage(): void {
    try {
      const cartData = localStorage.getItem('cart');
      console.log('📋 LocalStorage cart data on init:', cartData);
      
      if (cartData) {
        const parsed = JSON.parse(cartData);
        console.log('📊 Parsed localStorage items:', parsed.length);
        
        const serviceItems = this.cartService.getCartItems();
        console.log('🔍 Comparison:', {
          localStorage: parsed.length,
          serviceItems: serviceItems.length,
          componentItems: this.cartItems.length
        });
        
        if (parsed.length > 0 && this.cartItems.length === 0) {
          console.warn('⚠️ localStorage has items but component cart is empty!');
          this.forceCartReload();
        }
      }
    } catch (error: any) {
      console.error('❌ Error checking localStorage:', error);
    }
  }

  private forceCartReload(): void {
    console.log('🔄 Forcing cart reload...');
    
    const directItems = this.cartService.getCartItems();
    if (directItems.length !== this.cartItems.length) {
      console.log('🔄 Updating cart items from direct method');
      this.cartItems = [...directItems];
      this.calculateTotals();
    }
    
    setTimeout(() => {
      try {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
          const parsed = JSON.parse(cartData);
          if (parsed.length !== this.cartItems.length) {
            console.log('🔄 Updating from localStorage after timeout');
            const service = this.cartService as any;
            if (service.cartItemsSubject) {
              const cartItems = parsed.map((item: any) => ({
                ...item,
                addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
              }));
              service.cartItemsSubject.next(cartItems);
            }
          }
        }
      } catch (error: any) {
        console.error('❌ Error in force reload:', error);
      }
    }, 300);
  }

  calculateTotals(): void {
    console.log('💰 Calculating totals for', this.cartItems.length, 'items');
    
    this.subtotal = this.cartService.getTotalPrice();
    this.shipping = this.subtotal > 100 ? 0 : 15;
    this.tax = this.subtotal * 0.14;
    this.total = this.subtotal + this.shipping + this.tax;
    
    console.log('📊 Totals:', {
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total
    });
  }

 
  updateQuantity(item: CartItem, change: number): void {
    console.log('📈 Updating quantity for item:', item.product.name, 'change:', change);
    
    const newQuantity = item.quantity + change;
    
    if (newQuantity < 1) {
      this.removeItem(item);
      return;
    }
    
    const productStock = item.product.stock || 0;
    if (productStock > 0 && newQuantity > productStock) {
      this.notificationService.showError(`Available quantity: ${productStock}`);
      return;
    }
    

    const productId = this.convertToNumber(item.product.id);
    
    this.cartService.updateQuantity(productId, newQuantity).subscribe({
      next: (response: CartResponse) => {
        if (response.success) {
          this.notificationService.showSuccess('Quantity updated successfully');
          console.log('✅ Quantity updated successfully');
        } else {
          this.notificationService.showError(response.message || 'Failed to update quantity');
        }
      },
      error: (error: any) => {
        console.error('❌ Error updating quantity:', error);
        this.notificationService.showError('Error updating quantity');
      }
    });
  }


  removeItem(item: CartItem): void {
    console.log('🗑️ Removing item from cart:', item.product.name);
    
    if (confirm('Are you sure you want to remove this item from cart?')) {
      // ✅ الحل: تحويل ID إلى number
      const productId = this.convertToNumber(item.product.id);
      
      this.cartService.removeFromCart(productId).subscribe({
        next: (response: CartResponse) => {
          if (response.success) {
            this.notificationService.showSuccess('Item removed from cart');
            console.log('✅ Item removed successfully');
          } else {
            this.notificationService.showError(response.message || 'Failed to remove item');
          }
        },
        error: (error: any) => {
          console.error('❌ Error removing item:', error);
          this.notificationService.showError('Error removing item');
        }
      });
    }
  }

  
  moveToWishlist(item: CartItem): void {
    console.log('💖 Moving item to wishlist:', item.product.name);
    
    if (!this.isAuthenticated) {
      this.notificationService.showError('Please login first');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/cart' } });
      return;
    }

    this.wishlistService.addToWishlist({
      product: item.product,
      addedAt: new Date()
    }).subscribe({
      next: () => {
      
        const productId = this.convertToNumber(item.product.id);
        
        this.cartService.removeFromCart(productId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Item moved to wishlist');
            console.log('✅ Item moved to wishlist successfully');
          },
          error: (error: any) => {
            console.error('❌ Error removing from cart after wishlist:', error);
          }
        });
      },
      error: (error: any) => {
        console.error('❌ Error adding to wishlist:', error);
        this.notificationService.showError('Failed to move to wishlist');
      }
    });
  }

 
  saveForLater(item: CartItem): void {
    console.log('💾 Saving item for later:', item.product.name);
    
    try {
      const savedItemsStr = localStorage.getItem('savedForLater');
      const savedItems: Product[] = savedItemsStr ? JSON.parse(savedItemsStr) : [];
      
      const exists = savedItems.some(savedItem => savedItem.id === item.product.id);
      
      if (!exists) {
        savedItems.push(item.product);
        localStorage.setItem('savedForLater', JSON.stringify(savedItems));
        
   
        const productId = this.convertToNumber(item.product.id);
        
        this.cartService.removeFromCart(productId).subscribe({
          next: () => {
            this.notificationService.showSuccess('Item saved for later');
            console.log('✅ Item saved for later');
          },
          error: (error: any) => {
            console.error('❌ Error removing from cart:', error);
          }
        });
      } else {
    
        const productId = this.convertToNumber(item.product.id);
        
        this.cartService.removeFromCart(productId).subscribe({
          next: () => {
            this.notificationService.showInfo('Item already in saved list - removed from cart');
          },
          error: (error: any) => {
            console.error('❌ Error removing from cart:', error);
          }
        });
      }
    } catch (error: any) {
      console.error('❌ Error saving item for later:', error);
      this.notificationService.showError('Failed to save item');
    }
  }

  clearCart(): void {
    console.log('🧹 Clearing entire cart...');
    
    if (confirm('Are you sure you want to clear the entire cart?')) {
      this.cartService.clearCart().subscribe({
        next: (response: CartResponse) => {
          if (response.success) {
            this.notificationService.showSuccess('Cart cleared successfully');
            console.log('✅ Cart cleared successfully');
          } else {
            this.notificationService.showError(response.message || 'Failed to clear cart');
          }
        },
        error: (error: any) => {
          console.error('❌ Error clearing cart:', error);
          this.notificationService.showError('Error clearing cart');
        }
      });
    }
  }

  proceedToCheckout(): void {
    console.log('🚀 Proceeding to checkout...');
    
    if (this.cartItems.length === 0) {
      this.notificationService.showError('Your cart is empty');
      return;
    }

    if (!this.isAuthenticated) {
      this.notificationService.showError('Please login to continue');
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }

    console.log('🛒 Cart items before checkout:', this.cartItems.length);
    this.router.navigate(['/checkout']);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  // ✅ إصلاح: تقبل number أو undefined
  getCategoryName(categoryId: number | undefined): string {
    if (!categoryId) return 'General';
    
    const categories: { [key: number]: string } = {
      1: 'Electronics',
      2: 'Clothing',
      3: 'Books',
      4: 'Home',
      5: 'Sports',
      6: 'Beauty'
    };
    return categories[categoryId] || 'General';
  }

  getSavedItems(): Product[] {
    try {
      const savedItems = localStorage.getItem('savedForLater');
      const items = savedItems ? JSON.parse(savedItems) : [];
      console.log('📋 Saved items:', items.length);
      return items;
    } catch (error: any) {
      console.error('❌ Error getting saved items:', error);
      return [];
    }
  }

  addSavedToCart(product: Product): void {
    console.log('🛒 Adding saved item to cart:', product.name);
    
    try {
      this.cartService.addToCart(product, 1).subscribe({
        next: (response: CartResponse) => {
          if (response.success) {
            const savedItems = this.getSavedItems();
            const updatedItems = savedItems.filter(item => item.id !== product.id);
            localStorage.setItem('savedForLater', JSON.stringify(updatedItems));
            
            this.notificationService.showSuccess('Item added to cart');
            console.log('✅ Saved item added to cart');
          } else {
            this.notificationService.showError(response.message || 'Failed to add item');
          }
        },
        error: (error: any) => {
          console.error('❌ Error adding saved item:', error);
          this.notificationService.showError('Error adding item to cart');
        }
      });
    } catch (error: any) {
      console.error('❌ Error in addSavedToCart:', error);
      this.notificationService.showError('Failed to add item to cart');
    }
  }

 
  private convertToNumber(id: string | number): number {
    if (typeof id === 'string') {
      const parsed = parseInt(id, 10);
      return isNaN(parsed) ? 0 : parsed;
    }
    return id;
  }

  debugCart(): void {
    console.log('=== CART COMPONENT DEBUG ===');
    
    console.log('1. Cart items in component:', this.cartItems.length);
    console.log('   Items:', this.cartItems);
    
    console.log('2. Cart items from service:', this.cartService.getCartItems().length);
    console.log('   Service items:', this.cartService.getCartItems());
    
    console.log('3. Cart count from service:', this.cartCount);
    
    try {
      const cartData = localStorage.getItem('cart');
      console.log('4. LocalStorage cart data:', cartData);
      
      if (cartData) {
        const parsed = JSON.parse(cartData);
        console.log('   Parsed items:', parsed.length);
        console.log('   Sample item:', parsed[0]);
      }
    } catch (error: any) {
      console.error('❌ Error reading localStorage:', error);
    }
    
    console.log('5. Cart totals:', {
      subtotal: this.subtotal,
      shipping: this.shipping,
      tax: this.tax,
      total: this.total
    });
    
    this.notificationService.showInfo('Cart debug completed. Check console.');
    console.log('=== END DEBUG ===');
  }

  forceUpdateCart(): void {
    console.log('🔄 Manually forcing cart update...');
    
    if ((this.cartService as any).forceCartRefresh) {
      (this.cartService as any).forceCartRefresh();
    }
    
    const serviceItems = this.cartService.getCartItems();
    this.cartItems = [...serviceItems];
    this.calculateTotals();
    
    this.notificationService.showInfo('Cart manually updated');
  }
}