import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity: number = 1;
  
  inCartQuantity: number = 0;
  isInWishlist: boolean = false;
  selectedColor: string = '';
  selectedSize: string = '';
  relatedProducts: Product[] = [];
  
  productImages: string[] = [];
  productFeatures: string[] = [];
  categoryName: string = '';
  
  private cartSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('🎬 Initializing product details page...');
    
    const productId = this.route.snapshot.paramMap.get('id');
    console.log('🔍 Product ID from URL:', productId);
    
    if (productId) {
      const numericId = +productId;
      this.loadProductDetails(numericId);
      this.checkWishlistStatus(productId);
      
     
      this.cartSubscription = this.cartService.cartItems$.subscribe({
        next: (cartItems) => {
          console.log('🔄 Cart updated:', cartItems.length, 'products');
          if (this.product) {
            const cartItem = cartItems.find(item => item.product && item.product.id === this.product!.id);
            this.inCartQuantity = cartItem ? cartItem.quantity : 0;
            console.log(`📦 Quantity in cart for product ${this.product.name}: ${this.inCartQuantity}`);
          }
        },
        error: (error) => {
          console.error('❌ Error loading cart:', error);
        }
      });
    } else {
      console.error('❌ No product ID in URL');
      this.notificationService.showError('Product ID not found');
    }
  }

  ngOnDestroy(): void {

    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
      console.log('🧹 Cart subscription cleaned up');
    }
  }


  getStockClass() {
    const stock = this.product?.stock || 0;
    return {
      'text-success': stock > 10,
      'text-warning': stock > 0 && stock <= 10,
      'text-danger': stock === 0
    };
  }


  getAvailableStock(): number {
    if (!this.product) return 0;
    
    const totalInCart = this.inCartQuantity;
    const maxOrderQuantity = 10;
    const productStock = this.product.stock || 0;
    
    const available = Math.min(productStock, maxOrderQuantity) - totalInCart;
    return Math.max(available, 0);
  }

  floor(value: number): number {
    return Math.floor(value);
  }

  
  getStarClass(rating: number, star: number): string {
    if (star <= Math.floor(rating)) {
      return 'fas fa-star';
    } else if (star - 0.5 <= rating) {
      return 'fas fa-star-half-alt';
    } else {
      return 'far fa-star';
    }
  }

 
  getSimpleStarClass(rating: number, star: number): string {
    return star <= Math.floor(rating) ? 'fas fa-star' : 'far fa-star';
  }
  

  addToCartFromRelated(product: Product): void {
    console.log('🛒 Adding related product:', product?.name);
    
    if (!product) {
      console.error('❌ Invalid product');
      return;
    }
    
    if (!this.authService.isLoggedIn()) {
      console.log('⚠️ User not logged in');
      this.notificationService.showError('Please login to add to cart');
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url
        } 
      });
      return;
    }
    
    if (!product.stock || product.stock === 0) {
      this.notificationService.showError('This product is out of stock');
      return;
    }
    
    console.log(`➕ Adding related product: ${product.name} (ID: ${product.id})`);
    

    this.cartService.addToCart(product, 1).subscribe({
      next: (response) => {
        console.log('✅ Add to cart response:', response);
        
        if (response.success) {
          this.notificationService.showSuccess(response.message || 'Added to cart successfully!');
          
      
          if (this.product && product.id === this.product.id) {
            this.inCartQuantity += 1;
            console.log(`📈 Updated main product quantity to: ${this.inCartQuantity}`);
          }
        } else {
          console.error('❌ Failed to add product:', response.message);
          this.notificationService.showError(response.message || 'Failed to add to cart');
        }
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
        this.notificationService.showError('Error adding product to cart');
      },
      complete: () => {
        console.log('✅ Add to cart completed');
      }
    });
  }

  // ✅ Buy Now function with stock and auth checks
  buyNow(): void {
    console.log('⚡ Starting Buy Now...');
    
    if (!this.product) {
      this.notificationService.showError('Product not found');
      return;
    }
    
    // ✅ Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Please login to proceed to checkout');
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url
        } 
      });
      return;
    }
    
    // ✅ Check stock availability
    const availableStock = this.getAvailableStock();
    console.log(`📦 Available stock: ${availableStock}`);
    
    if (availableStock <= 0) {
      this.notificationService.showError('Product is out of stock');
      return;
    }
    
    if (this.quantity > availableStock) {
      this.notificationService.showError(`Only ${availableStock} items available`);
      this.quantity = availableStock;
      return;
    }
    
    console.log(`🛒 Adding ${this.quantity} of ${this.product.name} for instant checkout`);
    
    // ✅ Add product to cart with subscribe
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (response) => {
        console.log('✅ Buy Now response:', response);
        
        if (response.success) {
          this.inCartQuantity += this.quantity;
          console.log(`📈 New quantity in cart: ${this.inCartQuantity}`);
          
          // ✅ Proceed to checkout after confirmation
          setTimeout(() => {
            const cartItems = this.cartService.getCartItems();
            console.log(`📋 Cart items before checkout: ${cartItems.length} products`);
            
            if (cartItems.length > 0) {
              console.log('📍 Navigating to checkout...');
              this.router.navigate(['/checkout']);
            } else {
              this.notificationService.showError('Failed to add product to cart. Please try again.');
            }
          }, 300);
        } else {
          console.error('❌ Buy Now failed:', response.message);
          this.notificationService.showError(response.message || 'Failed to process order');
        }
      },
      error: (error) => {
        console.error('❌ Error in Buy Now:', error);
        this.notificationService.showError('Failed to process order');
      },
      complete: () => {
        console.log('✅ Buy Now process completed');
      }
    });
  }

  // ✅ Check wishlist status
  checkWishlistStatus(productId: string) {
    console.log(`🔍 Checking wishlist status for product ${productId}`);
    
    if (!this.wishlistService || !this.wishlistService.getWishlist) {
      console.error('❌ Wishlist service not available');
      return;
    }
    
    this.wishlistService.getWishlist().subscribe({
      next: (items: any[]) => {
        console.log('📋 Wishlist items:', items?.length || 0);
        
        if (!items || !Array.isArray(items)) {
          this.isInWishlist = false;
          return;
        }
        
        this.isInWishlist = items.some((item: any) => {
          if (!item) return false;
          
          // Check multiple ways to find the product
          const itemId = item.id ? item.id.toString() : '';
          const productItemId = (item.product && item.product.id) ? item.product.id.toString() : '';
          const directId = item.productId ? item.productId.toString() : '';
          
          return itemId === productId || productItemId === productId || directId === productId;
        });
        
        console.log(`⭐ Product in wishlist: ${this.isInWishlist}`);
      },
      error: (error: any) => {
        console.error('❌ Error checking wishlist:', error);
        this.isInWishlist = false;
      }
    });
  }

  toggleWishlist() {
    console.log('⭐ Toggling wishlist status');
    
    if (!this.product) return;
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Please login to use wishlist');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    if (this.isInWishlist) {
      this.removeFromWishlist();
    } else {
      this.addToWishlist();
    }
  }

  private addToWishlist() {
    console.log('➕ Adding to wishlist:', this.product?.name);
    
    if (!this.product) return;
    
    const wishlistItem = {
      id: this.product.id.toString(),
      productId: this.product.id,
      product: {
        id: this.product.id,
        name: this.product.name || '',
        price: this.product.price || 0,
        image: this.product.image || '',
        categoryId: this.product.categoryId || 0,
        description: this.product.description || '',
        rating: this.product.rating || 0,
        stock: this.product.stock || 0,
        originalPrice: this.product.originalPrice,
        colors: this.product.colors || [],
        sizes: this.product.sizes || []
      },
      addedAt: new Date()
    };
    
    this.wishlistService.addToWishlist(wishlistItem).subscribe({
      next: () => {
        this.isInWishlist = true;
        console.log('✅ Added to wishlist');
        this.notificationService.showSuccess('Added to wishlist');
      },
      error: (error: any) => {
        console.error('❌ Error adding to wishlist:', error);
        this.notificationService.showError('Failed to add to wishlist');
      }
    });
  }

  private removeFromWishlist() {
    console.log('➖ Removing from wishlist:', this.product?.name);
    
    if (!this.product) return;
    
    this.wishlistService.removeFromWishlist(this.product.id.toString()).subscribe({
      next: () => {
        this.isInWishlist = false;
        console.log('✅ Removed from wishlist');
        this.notificationService.showInfo('Removed from wishlist');
      },
      error: (error: any) => {
        console.error('❌ Error removing from wishlist:', error);
        this.notificationService.showError('Failed to remove from wishlist');
      }
    });
  }

  loadProductDetails(productId: number) {
    console.log(`📥 Loading product details ID: ${productId}`);
    
    if (!this.productService || !this.productService.getProductById) {
      this.notificationService.showError('Product service not available');
      return;
    }
    
    const product = this.productService.getProductById(productId);
    
    if (product) {
      this.product = product;
      console.log('✅ Product loaded:', product.name);
      this.initializeProductData();
      
      if (this.product.colors && this.product.colors.length > 0) {
        this.selectedColor = this.product.colors[0];
        console.log(`🎨 Selected color: ${this.selectedColor}`);
      }
      
      if (this.product.sizes && this.product.sizes.length > 0) {
        this.selectedSize = this.product.sizes[0];
        console.log(`📏 Selected size: ${this.selectedSize}`);
      }
      
      this.loadRelatedProducts(this.product.categoryId);
    } else {
      console.error('❌ Product not found with ID:', productId);
      this.notificationService.showError('Product not found');
      this.product = null;
    }
  }

  initializeProductData() {
    if (!this.product) return;
    
    console.log('🔄 Initializing product data');
    
    // ✅ Create image array
    this.productImages = [this.product.image || ''];
    
    // ✅ Add additional images if there are different colors
    if (this.product.colors && this.product.colors.length > 0) {
      this.product.colors.forEach((color, index) => {
        if (index > 0 && this.product) {
          this.productImages.push(this.product!.image || '');
        }
      });
    }
    
    this.productFeatures = [
      'High quality materials',
      'Durable construction',
      'Excellent value for money'
    ];
    
    this.categoryName = this.getCategoryName(this.product.categoryId || 0);
    console.log(`🏷️ Category: ${this.categoryName}`);
  }

  getCategoryName(categoryId: number): string {
    const categories: {[key: number]: string} = {
      1: 'Electronics',
      2: 'Clothing',
      3: 'Books',
      4: 'Home',
      5: 'Sports',
      6: 'Beauty'
    };
    return categories[categoryId] || 'General';
  }

  loadRelatedProducts(categoryId: number): void {
    console.log(`🔗 Loading related products for category: ${categoryId}`);
    
    if (!this.productService || !this.productService.getProductsByCategory) {
      console.error('❌ Product service not available');
      return;
    }
    
    const allProducts = this.productService.getProductsByCategory(categoryId);
    
    if (allProducts && Array.isArray(allProducts)) {
      this.relatedProducts = allProducts
        .filter(p => p && p.id !== this.product?.id)
        .slice(0, 4);
      
      console.log(`✅ Loaded ${this.relatedProducts.length} related products`);
    }
  }

  getDiscountPercentage(): number {
    if (!this.product || !this.product.originalPrice || this.product.originalPrice <= 0) {
      return 0;
    }
    const discount = ((this.product.originalPrice - this.product.price) / this.product.originalPrice) * 100;
    return Math.round(discount);
  }

  selectColor(color: string): void {
    this.selectedColor = color;
    console.log(`🎨 Color changed to: ${color}`);
  }

  selectSize(size: string): void {
    this.selectedSize = size;
    console.log(`📏 Size changed to: ${size}`);
  }

  addToCart() {
    console.log('🛒 Starting add to cart...');
    
    if (!this.product) {
      console.error('❌ No product to add');
      this.notificationService.showError('Product not found');
      return;
    }
    
    console.log('📊 Product data:', {
      id: this.product.id,
      name: this.product.name,
      price: this.product.price,
      stock: this.product.stock,
      inCart: this.inCartQuantity
    });
    
    // ✅ Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      console.log('⚠️ User not logged in');
      this.notificationService.showError('Please login to add to cart');
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: this.router.url
        } 
      });
      return;
    }
    
    // ✅ Check stock availability
    const availableStock = this.getAvailableStock();
    console.log(`📦 Available stock: ${availableStock}`);
    
    if (availableStock <= 0) {
      this.notificationService.showError('This product is out of stock');
      return;
    }
    
    if (this.quantity > availableStock) {
      this.notificationService.showError(`Only ${availableStock} items available`);
      this.quantity = availableStock;
      return;
    }
    
    console.log(`➕ Adding ${this.quantity} of ${this.product.name} to cart`);
    
    // ✅ Correct usage with subscribe
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (response) => {
        console.log('✅ Add to cart response:', response);
        
        if (response.success) {
          // Update local quantity
          this.inCartQuantity += this.quantity;
          
          console.log(`📈 New quantity in cart: ${this.inCartQuantity}`);
          console.log(`💰 Total: ${response.total}`);
          console.log(`🔢 Item count: ${response.itemCount}`);
          
          this.notificationService.showSuccess(
            response.message || 'Product added to cart successfully!'
          );
          
          // Reset quantity
          this.quantity = 1;
          
          // ✅ Quick localStorage check
          setTimeout(() => {
            const storedCart = localStorage.getItem('cart');
            console.log('💾 localStorage after addition:', storedCart ? `Contains ${JSON.parse(storedCart).length} products` : 'Empty');
          }, 100);
          
        } else {
          console.error('❌ Addition failed:', response.message);
          this.notificationService.showError(response.message || 'Failed to add to cart');
        }
      },
      error: (error) => {
        console.error('❌ Error adding to cart:', error);
        this.notificationService.showError('Error adding product to cart');
      },
      complete: () => {
        console.log('✅ Add to cart process completed');
      }
    });
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      console.log(`➖ Decreased quantity to: ${this.quantity}`);
    } else {
      console.log('⚠️ Quantity cannot be less than 1');
    }
  }

  increaseQuantity() {
    const availableStock = this.getAvailableStock();
    console.log(`📈 Attempting to increase quantity. Available: ${availableStock}`);
    
    if (this.quantity < availableStock) {
      this.quantity++;
      console.log(`➕ Increased quantity to: ${this.quantity}`);
    } else {
      console.log(`⚠️ Reached maximum: ${availableStock}`);
      this.notificationService.showError(`Maximum available: ${availableStock}`);
    }
  }

  shareProduct() {
    console.log('📤 Sharing product...');
    
    if (!this.product) return;
    
    const shareData = {
      title: this.product.name || 'Product',
      text: `Check out this product: ${this.product.name}`,
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData).then(() => {
        console.log('✅ Shared successfully');
      }).catch((error: any) => {
        console.error('❌ Error sharing:', error);
      });
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          console.log('✅ Link copied');
          this.notificationService.showSuccess('Link copied to clipboard');
        })
        .catch((error: any) => {
          console.error('❌ Failed to copy link:', error);
        });
    }
  }

  writeReview() {
    console.log('✍️ Writing review...');
    
    if (!this.authService.isLoggedIn()) {
      this.notificationService.showError('Please login to write a review');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    
    if (this.product) {
      console.log(`📝 Navigating to write review for product: ${this.product.id}`);
      this.router.navigate(['/write-review'], {
        queryParams: { productId: this.product.id }
      });
    }
  }
}