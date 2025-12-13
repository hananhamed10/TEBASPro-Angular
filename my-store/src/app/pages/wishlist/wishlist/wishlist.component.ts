import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WishlistService, WishlistItem } from '../../../core/services/wishlist.service';
import { CartService, CartResponse } from '../../../core/services/cart.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistPage implements OnInit, OnDestroy {
  items: WishlistItem[] = [];
  loading: boolean = true;
  error: string = '';
  private imageCache: { [key: string]: string } = {};
  private wishlistSubscription: Subscription = new Subscription();
  private cartSubscription: Subscription = new Subscription();
  isAddingToCart: { [key: string]: boolean } = {};
  isAddingAllToCart: boolean = false;
  sortOption: string = 'date';

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
    this.initializeCartListener();
    this.listenToCartUpdates();
  }

  ngOnDestroy(): void {
    this.wishlistSubscription.unsubscribe();
    this.cartSubscription.unsubscribe();
  }

  private initializeCartListener(): void {
    window.addEventListener('cartUpdated', (event: any) => {
      console.log('📢 Cart updated event received:', event.detail);
    });
  }

  private listenToCartUpdates(): void {
    this.cartSubscription = this.cartService.cartItems$.subscribe({
      next: (items) => {
        console.log('🔄 Cart items updated:', items.length);
      },
      error: (error) => {
        console.error('❌ Cart subscription error:', error);
      }
    });
  }

  loadWishlist(): void {
    this.loading = true;
    this.error = '';
    this.imageCache = {};
    
    this.wishlistSubscription = this.wishlistService.getWishlist().subscribe({
      next: (items: WishlistItem[]) => {
        this.items = items || [];
        this.loading = false;
        console.log('✅ Wishlist loaded:', this.items.length, 'items');
        
        this.preloadImages();
        this.sortItems();
      },
      error: (error: any) => {
        console.error('❌ Error loading wishlist:', error);
        this.error = 'Failed to load wishlist. Please try again.';
        this.loading = false;
        this.notificationService.showError('Failed to load wishlist');
      }
    });
  }

  private preloadImages(): void {
    this.items.forEach(item => {
      if (item && item.product) {
        const img = new Image();
        img.src = this.getProductImage(item);
      }
    });
  }

  getProductImage(item: WishlistItem): string {
    if (!item || !item.product) {
      return 'assets/images/products/placeholder.jpg';
    }
    
    if (this.imageCache[item.id]) {
      return this.imageCache[item.id];
    }
    
    const product = item.product;
    let imagePath = 'assets/images/products/placeholder.jpg';
    
    if (product.image) {
      imagePath = this.processImage(product.image);
    } else if (product.images && product.images.length > 0) {
      imagePath = this.processImage(product.images[0]);
    } else if (product.thumbnail) {
      imagePath = product.thumbnail;
    }
    
    this.imageCache[item.id] = imagePath;
    return imagePath;
  }

  private processImage(image: any): string {
    if (!image) return 'assets/images/products/placeholder.jpg';
    
    if (typeof image === 'string') {
      const validPatterns = [
        /^https?:\/\//,
        /^\/assets\//,
        /^\//,
        /^\.\.\//,
        /^\.\//,
        /^data:image\//,
        /^blob:/
      ];
      
      for (const pattern of validPatterns) {
        if (pattern.test(image)) {
          return image;
        }
      }
      
      return `assets/images/products/${image}`;
    }
    
    if (typeof image === 'object') {
      if (image.url) return image.url;
      if (image.path) return image.path;
      if (image.src) return image.src;
      if (image.thumbnail) return image.thumbnail;
      if (image.base64) return image.base64;
    }
    
    return 'assets/images/products/placeholder.jpg';
  }

  handleImageError(event: any, item: WishlistItem): void {
    console.warn('⚠️ Image failed to load for item:', item?.product?.name);
    if (event.target) {
      event.target.src = 'assets/images/products/placeholder.jpg';
      event.target.onerror = null;
      
      if (item?.id) {
        this.imageCache[item.id] = 'assets/images/products/placeholder.jpg';
      }
    }
  }

  getStockStatus(item: WishlistItem): string {
    if (!item || !item.product) return 'Unavailable';
    
    const stock = item.product.stock || 0;
    
    if (stock > 10) return 'In Stock';
    if (stock > 0) return `Only ${stock} left`;
    return 'Out of Stock';
  }

  getStockBadgeClass(item: WishlistItem): string {
    if (!item || !item.product) return 'out-of-stock';
    
    const stock = item.product.stock || 0;
    
    if (stock > 10) return 'in-stock';
    if (stock > 0) return 'low-stock';
    return 'out-of-stock';
  }

  calculateDiscount(item: WishlistItem): number {
    if (!item || !item.product) return 0;
    
    const price = item.product.price || 0;
    const originalPrice = item.product.originalPrice || 0;
    
    if (originalPrice <= 0 || price >= originalPrice) return 0;
    
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  }

  getAvailableItemsCount(): number {
    return this.items.filter(item => {
      if (!item || !item.product) return false;
      return item.product.stock > 0;
    }).length;
  }

  getTotalValue(): number {
    return this.items.reduce((total: number, item: WishlistItem) => {
      if (!item || !item.product) return total;
      return total + (item.product.price || 0);
    }, 0);
  }

  goToProduct(item: WishlistItem): void {
    if (!item || !item.product || !item.product.id) {
      this.notificationService.showError('Product not found');
      return;
    }
    
    this.router.navigate(['/products', item.product.id.toString()]);
  }

  // 🛒 Modified main function
  addToCart(item: WishlistItem): void {
    console.log('=== addToCart START ===');
    
    if (!item || !item.product) {
      this.notificationService.showError('Product not found');
      return;
    }
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Please login to add product to cart');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    const stock = item.product.stock || 0;
    if (stock <= 0) {
      this.notificationService.showError('This product is currently unavailable');
      return;
    }
    
    this.isAddingToCart[item.id] = true;
    
    console.log('🛒 Product:', {
      id: item.product.id,
      name: item.product.name,
      price: item.product.price,
      categoryId: item.product.categoryId,
      stock: item.product.stock,
      image: item.product.image
    });
    
    try {
      const productToAdd = {
        id: item.product.id,
        name: item.product.name || `Product ${item.product.id}`,
        description: item.product.description || 'No description available',
        price: item.product.price || 0,
        image: item.product.image || 'assets/images/products/placeholder.jpg',
        categoryId: item.product.categoryId || 1,
        stock: item.product.stock || 0,
        originalPrice: item.product.originalPrice || item.product.price || 0,
        color: item.product.color || '',
        size: item.product.size || '',
        colors: item.product.colors || [],
        sizes: item.product.sizes || [],
        rating: item.product.rating || 0,
        discount: item.product.discount || 0,
        isFeatured: item.product.isFeatured || false,
        reviews: item.product.reviews || 0
      };
      
      console.log('✅ Prepared product for cart:', productToAdd);
      
      this.cartService.addToCart(productToAdd, 1).subscribe({
        next: (response: CartResponse) => {
          console.log('✅ Cart service response:', response);
          this.isAddingToCart[item.id] = false;
          
          if (response && response.success) {
            console.log('🎉 Success! Product added to cart');
            this.notificationService.showSuccess(
              response.message || 'Product added to cart successfully!'
            );
            
            // ✅ Force cart refresh
            this.forceCartRefresh();
            
            // ✅ Verify addition
            this.verifyCartAddition(item);
            
          } else {
            console.error('❌ Cart service returned success:false', response);
            this.notificationService.showError(response?.message || 'Failed to add product to cart');
          }
        },
        error: (error: any) => {
          this.isAddingToCart[item.id] = false;
          console.error('❌ Error from cart service:', error);
          this.notificationService.showError('Failed to add product to cart. Please try again.');
        }
      });
      
    } catch (outerError: any) {
      this.isAddingToCart[item.id] = false;
      console.error('❌ Outer try-catch error:', outerError);
      this.notificationService.showError('An unexpected error occurred. Please try again.');
    }
    
    console.log('=== addToCart END ===');
  }

  // ✅ Function to force cart refresh
  private forceCartRefresh(): void {
    setTimeout(() => {
      try {
        console.log('🔄 Forcing cart refresh from wishlist...');
        
        // Method 1: Use forceCartRefresh from service if available
        if ((this.cartService as any).forceCartRefresh) {
          (this.cartService as any).forceCartRefresh();
        }
        
        // Method 2: Reload data from localStorage
        this.reloadCartFromStorage();
        
        // Method 3: Send update event
        const event = new CustomEvent('cartForceRefresh', {
          detail: { timestamp: new Date().toISOString() }
        });
        window.dispatchEvent(event);
        
        console.log('✅ Cart refresh forced');
      } catch (error) {
        console.error('❌ Error forcing cart refresh:', error);
      }
    }, 100);
  }

  // ✅ Function to reload cart from localStorage
  private reloadCartFromStorage(): void {
    try {
      const cartData = localStorage.getItem('cart');
      if (cartData) {
        const items = JSON.parse(cartData);
        console.log('📋 Reloaded cart from localStorage:', items.length, 'items');
        
        // Update BehaviorSubject manually
        const service = this.cartService as any;
        if (service.cartItemsSubject) {
          const cartItems = items.map((item: any) => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date()
          }));
          service.cartItemsSubject.next(cartItems);
          console.log('✅ Cart subject updated from localStorage');
        }
      }
    } catch (error) {
      console.error('❌ Error reloading cart:', error);
    }
  }

  private verifyCartAddition(item: WishlistItem): void {
    setTimeout(() => {
      try {
        const cartItems = this.cartService.getCartItems();
        console.log('🔍 Verifying cart addition...');
        console.log('📦 Current cart items from service:', cartItems.length);
        
        const isInCart = cartItems.some(cartItem => 
          cartItem.product && cartItem.product.id === item.product.id
        );
        
        if (isInCart) {
          console.log('✅ Product verified in cart');
        } else {
          console.warn('⚠️ Product not found in cart after addition');
          console.log('Checking localStorage directly...');
          
          try {
            const cartData = localStorage.getItem('cart');
            console.log('📋 LocalStorage cart data:', cartData);
            
            if (cartData) {
              const parsed = JSON.parse(cartData);
              console.log('📊 Parsed cart data:', parsed);
              console.log('🔢 Number of items in localStorage:', parsed.length);
            }
          } catch (lsError) {
            console.error('❌ Error accessing localStorage:', lsError);
          }
        }
      } catch (error: any) {
        console.error('❌ Error verifying cart:', error);
      }
    }, 500);
  }

  // ✅ Check localStorage contents directly
  checkLocalStorageCart(): void {
    console.log('=== CHECKING LOCALSTORAGE CART ===');
    
    try {
      const cartData = localStorage.getItem('cart');
      console.log('📋 Raw cart data from localStorage:', cartData);
      
      if (cartData) {
        const parsed = JSON.parse(cartData);
        console.log('📊 Parsed cart items:', parsed);
        console.log('🔢 Number of items:', parsed.length);
        
        if (parsed.length > 0) {
          console.log('🔍 First item details:', {
            productId: parsed[0].product?.id,
            productName: parsed[0].product?.name,
            quantity: parsed[0].quantity
          });
        }
      } else {
        console.log('📭 Cart is empty in localStorage');
      }
    } catch (error) {
      console.error('❌ Error checking localStorage:', error);
    }
    
    console.log('=== END CHECK ===');
    this.notificationService.showInfo('Cart contents checked. Check console.');
  }

  // ✅ Comprehensive cart check
  checkCartDebug(): void {
    console.log('=== COMPREHENSIVE CART DEBUG ===');
    
    try {
      // 1. Check localStorage
      const cartData = localStorage.getItem('cart');
      console.log('1. 📋 localStorage cart data:', cartData);
      
      if (cartData) {
        try {
          const parsed = JSON.parse(cartData);
          console.log('   📊 Parsed items:', parsed.length);
          console.log('   🔍 Sample item:', parsed[0]);
        } catch (parseError) {
          console.error('   ❌ Parse error:', parseError);
        }
      }
      
      // 2. Check CartService
      const serviceItems = this.cartService.getCartItems();
      console.log('2. 🛒 CartService.getCartItems():', serviceItems.length);
      console.log('   🔍 Sample:', serviceItems[0]);
      
      // 3. Check Observable
      console.log('3. 🔄 CartService.cartItems$ subscription active');
      
      // 4. Check BehaviorSubject
      const service = this.cartService as any;
      if (service.cartItemsSubject) {
        console.log('4. 🎯 cartItemsSubject value:', service.cartItemsSubject.value);
        console.log('   🔢 Length:', service.cartItemsSubject.value.length);
      }
      
      // 5. Check if current product is in cart
      if (this.items.length > 0) {
        const sampleItem = this.items[0];
        const isInCart = this.cartService.isProductInCart(sampleItem.product?.id || 0);
        console.log('5. 🛍️ Is first wishlist item in cart?', isInCart);
      }
      
    } catch (error: any) {
      console.error('❌ Error in debug:', error);
    }
    
    this.notificationService.showInfo('Cart checked comprehensively. Check console.');
    console.log('=== END DEBUG ===');
  }

  addAllToCart(): void {
    console.log('=== addAllToCart START ===');
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Please login to add products to cart');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    const availableItems = this.items.filter(item => {
      if (!item || !item.product) return false;
      return item.product.stock > 0;
    });
    
    console.log('📦 Available items to add:', availableItems.length);
    
    if (availableItems.length === 0) {
      this.notificationService.showError('No available products to add to cart');
      return;
    }
    
    this.isAddingAllToCart = true;
    
    // Use moveWishlistToCart if available
    if (typeof (this.cartService as any).moveWishlistToCart === 'function') {
      const wishlistProducts = availableItems.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name || `Product ${item.product.id}`,
          description: item.product.description || '',
          price: item.product.price || 0,
          image: item.product.image || 'assets/images/products/placeholder.jpg',
          categoryId: item.product.categoryId || 1,
          stock: item.product.stock || 0,
          originalPrice: item.product.originalPrice || item.product.price || 0,
          color: item.product.color || '',
          size: item.product.size || '',
          colors: item.product.colors || [],
          sizes: item.product.sizes || [],
          rating: item.product.rating || 0,
          discount: item.product.discount || 0,
          isFeatured: item.product.isFeatured || false,
          reviews: item.product.reviews || 0
        }
      }));
      
      (this.cartService as any).moveWishlistToCart(wishlistProducts).subscribe({
        next: (response: CartResponse) => {
          this.isAddingAllToCart = false;
          
          if (response && response.success) {
            console.log('✅ Successfully added all items');
            this.notificationService.showSuccess(
              response.message || `Added ${response.addedCount || availableItems.length} products to cart`
            );
            
            // Force cart refresh
            this.forceCartRefresh();
          } else {
            this.notificationService.showError(response?.message || 'Failed to add products to cart');
          }
        },
        error: (error: any) => {
          this.isAddingAllToCart = false;
          console.error('❌ Error adding all items:', error);
          this.notificationService.showError('Error occurred while adding products');
        }
      });
    } else {
      let successCount = 0;
      let errorCount = 0;
      const processNext = (index: number) => {
        if (index >= availableItems.length) {
          this.isAddingAllToCart = false;
          
          if (successCount > 0) {
            this.notificationService.showSuccess(`Added ${successCount} products to cart`);
            // Force cart refresh
            this.forceCartRefresh();
          }
          
          if (errorCount > 0) {
            this.notificationService.showWarning(`Failed to add ${errorCount} products`);
          }
          
          return;
        }
        
        const item = availableItems[index];
        const productToAdd = {
          id: item.product.id,
          name: item.product.name || `Product ${item.product.id}`,
          description: item.product.description || '',
          price: item.product.price || 0,
          image: item.product.image || 'assets/images/products/placeholder.jpg',
          categoryId: item.product.categoryId || 1,
          stock: item.product.stock || 0,
          originalPrice: item.product.originalPrice || item.product.price || 0,
          color: item.product.color || '',
          size: item.product.size || '',
          colors: item.product.colors || [],
          sizes: item.product.sizes || [],
          rating: item.product.rating || 0,
          discount: item.product.discount || 0,
          isFeatured: item.product.isFeatured || false,
          reviews: item.product.reviews || 0
        };
        
        this.cartService.addToCart(productToAdd, 1).subscribe({
          next: (response: CartResponse) => {
            if (response && response.success) {
              successCount++;
            } else {
              errorCount++;
            }
            processNext(index + 1);
          },
          error: (error: any) => {
            errorCount++;
            processNext(index + 1);
          }
        });
      };
      
      processNext(0);
    }
    
    console.log('=== addAllToCart END ===');
  }

  removeItem(item: WishlistItem): void {
    if (!item || !item.id) {
      this.notificationService.showError('Unable to delete item: ID not found');
      return;
    }
    
    if (confirm('Are you sure you want to delete this product from your wishlist?')) {
      this.wishlistService.removeFromWishlist(item.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.items = this.items.filter(i => i.id !== item.id);
            delete this.imageCache[item.id];
            this.notificationService.showSuccess('Product removed from wishlist');
          } else {
            this.notificationService.showError(response.message || 'Failed to remove product');
          }
        },
        error: (error: any) => {
          console.error('Error removing item:', error);
          this.notificationService.showError('Failed to remove product');
        }
      });
    }
  }

  clearAll(): void {
    if (this.items.length === 0) {
      this.notificationService.showInfo('Wishlist is already empty');
      return;
    }
    
    if (confirm('Are you sure you want to delete all products from your wishlist?')) {
      this.wishlistService.clearWishlist().subscribe({
        next: (response: any) => {
          if (response.success) {
            this.items = [];
            this.imageCache = {};
            this.notificationService.showSuccess('All products removed from wishlist');
          } else {
            this.notificationService.showError(response.message || 'Failed to clear wishlist');
          }
        },
        error: (error: any) => {
          console.error('Error clearing wishlist:', error);
          this.notificationService.showError('Failed to clear wishlist');
        }
      });
    }
  }

  getItemCount(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  getAverageRating(): number {
    if (this.items.length === 0) return 0;
    
    const validItems = this.items.filter(item => 
      item && item.product && item.product.rating
    );
    
    if (validItems.length === 0) return 0;
    
    const totalRating = validItems.reduce((sum, item) => 
      sum + (item.product.rating || 0), 0
    );
    
    return Math.round((totalRating / validItems.length) * 10) / 10;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (isNaN(diffDays)) return 'Recently';
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      });
    } catch (error) {
      return 'Recently';
    }
  }

  sortBy(option: string): void {
    this.sortOption = option;
    this.sortItems();
  }

  private sortItems(): void {
    switch (this.sortOption) {
      case 'date':
        this.items.sort((a, b) => {
          const dateA = new Date(a.addedDate).getTime();
          const dateB = new Date(b.addedDate).getTime();
          return dateB - dateA;
        });
        break;
      case 'price-low':
        this.items.sort((a, b) => 
          (a.product?.price || 0) - (b.product?.price || 0)
        );
        break;
      case 'price-high':
        this.items.sort((a, b) => 
          (b.product?.price || 0) - (a.product?.price || 0)
        );
        break;
      case 'name':
        this.items.sort((a, b) => 
          (a.product?.name || '').localeCompare(b.product?.name || '')
        );
        break;
      case 'stock':
        this.items.sort((a, b) => 
          (b.product?.stock || 0) - (a.product?.stock || 0)
        );
        break;
    }
  }

  refreshWishlist(): void {
    this.loadWishlist();
    this.notificationService.showInfo('Refreshing wishlist...');
  }

  shareWishlist(): void {
    const wishlistUrl = window.location.href;
    navigator.clipboard.writeText(wishlistUrl).then(() => {
      this.notificationService.showSuccess('Wishlist link copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      this.notificationService.showError('Failed to copy link');
    });
  }

  exportWishlist(): void {
    if (typeof (this.wishlistService as any).exportWishlist === 'function') {
      const exportData = (this.wishlistService as any).exportWishlist();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wishlist-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
      this.notificationService.showSuccess('Wishlist exported successfully!');
    } else {
      this.notificationService.showError('Export feature not available');
    }
  }
}