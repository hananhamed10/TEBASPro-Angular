import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem, Product } from '../../core/models/model';

export interface CartResponse {
    success: boolean;
    message?: string;
    cart?: CartItem[];
    total?: number;
    itemCount?: number;
    addedCount?: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
    cartItems$ = this.cartItemsSubject.asObservable();
    
    private cartCountSubject = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCountSubject.asObservable();
    
    private cartTotalSubject = new BehaviorSubject<number>(0);
    cartTotal$ = this.cartTotalSubject.asObservable();
    
    constructor() {
        this.loadInitialCart();
    }
    
    private loadInitialCart(): void {
        const items = this.loadCart();
        this.cartItemsSubject.next(items);
        this.updateCartStats();
    }
    
    private loadCart(): CartItem[] {
        try {
            const cart = localStorage.getItem('cart');
            
            if (cart) {
                const items = JSON.parse(cart);
                
                const validItems = items
                    .filter((item: any) => item && item.product && item.product.id)
                    .map((item: any) => ({
                        ...item,
                        addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
                        product: this.validateProduct(item.product)
                    }));
                
                return validItems;
            }
            return [];
        } catch (error: any) {
            console.error('❌ Error loading cart:', error);
            localStorage.removeItem('cart');
            return [];
        }
    }
    
    private validateProduct(product: any): Product {
        // ✅ تحويل id إلى number دائمًا
        const productId = typeof product.id === 'string' ? 
                         parseInt(product.id, 10) || 0 : 
                         Number(product.id) || 0;
        
        return {
            id: productId, // ⬅️ الآن دائماً number
            name: product.name || 'Unknown Product',
            description: product.description || '',
            price: product.price || 0,
            image: product.image || 'assets/images/products/placeholder.jpg',
            categoryId: product.categoryId || 1,
            stock: product.stock || 0,
            originalPrice: product.originalPrice || product.price || 0,
            color: product.color || '',
            size: product.size || '',
            colors: product.colors || [],
            sizes: product.sizes || [],
            rating: product.rating || 0,
            discount: product.discount || 0,
            isFeatured: product.isFeatured || false,
            reviews: product.reviews || 0
        };
    }
    
    private saveCart(items: CartItem[]): void {
        try {
            const validItems = items.filter(item => 
                item && item.product && item.product.id
            );
            
            localStorage.setItem('cart', JSON.stringify(validItems));
            
            this.cartItemsSubject.next(validItems);
            this.updateCartStats();
            
            this.dispatchCartUpdatedEvent();
            
        } catch (error: any) {
            console.error('❌ Error saving cart:', error);
            throw error;
        }
    }
    
    private updateCartStats(): void {
        const items = this.cartItemsSubject.value;
        
        const count = this.calculateItemCount(items);
        this.cartCountSubject.next(count);
        
        const total = this.calculateTotal(items);
        this.cartTotalSubject.next(total);
    }
    
    // ✅ تحديث: تقبل string أو number
    addToCart(product: Product, quantity: number = 1): Observable<CartResponse> {
        console.log('🛒 addToCart called:', { 
            id: product?.id, 
            name: product?.name,
            price: product?.price,
            quantity: quantity 
        });
        
        return new Observable<CartResponse>(subscriber => {
            try {
                if (!product) {
                    subscriber.next({
                        success: false,
                        message: 'Invalid product'
                    });
                    subscriber.complete();
                    return;
                }
                
                // ✅ تحويل id إلى number
                const productId = typeof product.id === 'string' ? 
                                 parseInt(product.id, 10) || 0 : 
                                 Number(product.id) || 0;
                
                if (!productId) {
                    subscriber.next({
                        success: false,
                        message: 'Invalid product ID'
                    });
                    subscriber.complete();
                    return;
                }
                
                const processedProduct: Product = {
                    id: productId, // ⬅️ الآن number
                    name: product.name || `Product ${productId}`,
                    description: product.description || '',
                    price: product.price || 0,
                    image: product.image || 'assets/images/products/placeholder.jpg',
                    categoryId: product.categoryId || 1,
                    stock: product.stock || 0,
                    originalPrice: product.originalPrice || product.price || 0,
                    color: product.color || '',
                    size: product.size || '',
                    colors: product.colors || [],
                    sizes: product.sizes || [],
                    rating: product.rating || 0,
                    discount: product.discount || 0,
                    isFeatured: product.isFeatured || false,
                    reviews: product.reviews || 0
                };
                
                const currentItems = this.cartItemsSubject.value;
                const existingIndex = currentItems.findIndex(item => 
                    item.product && item.product.id === productId
                );
                
                let message = '';
                let addedCount = quantity;
                const updatedItems = [...currentItems];
                
                if (existingIndex > -1) {
                    updatedItems[existingIndex] = {
                        ...updatedItems[existingIndex],
                        quantity: updatedItems[existingIndex].quantity + quantity
                    };
                    message = `Quantity updated to ${updatedItems[existingIndex].quantity}`;
                } else {
                    const newItem: CartItem = {
                        product: processedProduct,
                        quantity: quantity,
                        addedAt: new Date()
                    };
                    updatedItems.push(newItem);
                    message = 'Product added to cart successfully';
                }
                
                this.saveCart(updatedItems);
                
                const total = this.calculateTotal(updatedItems);
                const itemCount = this.calculateItemCount(updatedItems);
                
                const response: CartResponse = {
                    success: true,
                    message: message,
                    cart: updatedItems,
                    total: total,
                    itemCount: itemCount,
                    addedCount: addedCount
                };
                
                subscriber.next(response);
                subscriber.complete();
                
            } catch (error: any) {
                console.error('❌ Unexpected error in addToCart:', error);
                subscriber.next({
                    success: false,
                    message: 'Unexpected error occurred'
                });
                subscriber.complete();
            }
        });
    }
    
    // ✅ تحديث: تقبل string أو number
    removeFromCart(productId: string | number): Observable<CartResponse> {
        return new Observable<CartResponse>(subscriber => {
            try {
                // ✅ تحويل إلى number
                const id = typeof productId === 'string' ? 
                          parseInt(productId, 10) || 0 : 
                          Number(productId) || 0;
                
                if (!id) {
                    subscriber.next({
                        success: false,
                        message: 'Invalid product ID'
                    });
                    subscriber.complete();
                    return;
                }
                
                const currentItems = this.cartItemsSubject.value;
                const itemExists = currentItems.some(item => 
                    item.product && item.product.id === id
                );
                
                if (!itemExists) {
                    subscriber.next({
                        success: false,
                        message: 'Product not found in cart'
                    });
                    subscriber.complete();
                    return;
                }
                
                const updatedItems = currentItems.filter(item => 
                    item.product && item.product.id !== id
                );
                
                this.saveCart(updatedItems);
                
                subscriber.next({
                    success: true,
                    message: 'Product removed from cart',
                    cart: updatedItems,
                    total: this.calculateTotal(updatedItems),
                    itemCount: this.calculateItemCount(updatedItems)
                });
                subscriber.complete();
                
            } catch (error: any) {
                console.error('Error in removeFromCart:', error);
                subscriber.next({
                    success: false,
                    message: 'Failed to remove product'
                });
                subscriber.complete();
            }
        });
    }
    
    // ✅ تحديث: تقبل string أو number
    updateQuantity(productId: string | number, quantity: number): Observable<CartResponse> {
        return new Observable<CartResponse>(subscriber => {
            try {
                // ✅ تحويل إلى number
                const id = typeof productId === 'string' ? 
                          parseInt(productId, 10) || 0 : 
                          Number(productId) || 0;
                
                if (!id) {
                    subscriber.next({
                        success: false,
                        message: 'Invalid product ID'
                    });
                    subscriber.complete();
                    return;
                }
                
                if (quantity <= 0) {
                    this.removeFromCart(id).subscribe(response => {
                        subscriber.next(response);
                        subscriber.complete();
                    });
                    return;
                }
                
                const currentItems = this.cartItemsSubject.value;
                const itemIndex = currentItems.findIndex(item => 
                    item.product && item.product.id === id
                );
                
                if (itemIndex === -1) {
                    subscriber.next({
                        success: false,
                        message: 'Product not found in cart'
                    });
                    subscriber.complete();
                    return;
                }
                
                const updatedItems = [...currentItems];
                updatedItems[itemIndex] = {
                    ...updatedItems[itemIndex],
                    quantity: quantity
                };
                
                this.saveCart(updatedItems);
                
                subscriber.next({
                    success: true,
                    message: 'Quantity updated successfully',
                    cart: updatedItems,
                    total: this.calculateTotal(updatedItems),
                    itemCount: this.calculateItemCount(updatedItems)
                });
                subscriber.complete();
                
            } catch (error: any) {
                console.error('Error in updateQuantity:', error);
                subscriber.next({
                    success: false,
                    message: 'Failed to update quantity'
                });
                subscriber.complete();
            }
        });
    }
    
    // ✅ تحديث: تقبل string أو number
    isProductInCart(productId: string | number): boolean {
        const id = typeof productId === 'string' ? 
                  parseInt(productId, 10) || 0 : 
                  Number(productId) || 0;
        
        const items = this.cartItemsSubject.value;
        return items.some(item => item.product && item.product.id === id);
    }
    
    // ✅ تحديث: تقبل string أو number
    getProductQuantity(productId: string | number): number {
        const id = typeof productId === 'string' ? 
                  parseInt(productId, 10) || 0 : 
                  Number(productId) || 0;
        
        const items = this.cartItemsSubject.value;
        const item = items.find(item => item.product && item.product.id === id);
        return item ? item.quantity : 0;
    }
    
    // بقية الدوال كما هي...
    getCartItems(): CartItem[] {
        return [...this.cartItemsSubject.value];
    }
    
    getTotalPrice(): number {
        return this.calculateTotal(this.cartItemsSubject.value);
    }
    
    getItemCount(): number {
        return this.calculateItemCount(this.cartItemsSubject.value);
    }
    
    getCartCount(): number {
        return this.cartCountSubject.value;
    }
    
    getCartTotal(): number {
        return this.cartTotalSubject.value;
    }
    
    clearCart(): Observable<CartResponse> {
        return new Observable<CartResponse>(subscriber => {
            try {
                this.saveCart([]);
                
                subscriber.next({
                    success: true,
                    message: 'Cart cleared successfully',
                    cart: [],
                    total: 0,
                    itemCount: 0
                });
                subscriber.complete();
                
            } catch (error: any) {
                console.error('Error in clearCart:', error);
                subscriber.next({
                    success: false,
                    message: 'Failed to clear cart'
                });
                subscriber.complete();
            }
        });
    }
    
    moveWishlistToCart(items: any[]): Observable<CartResponse> {
        // ... بقية الكود كما هو
        return new Observable<CartResponse>(subscriber => {
            // ... implementation
        });
    }
    
    debugAndFixCart(): Observable<CartResponse> {
        // ... بقية الكود كما هو
        return new Observable<CartResponse>(subscriber => {
            // ... implementation
        });
    }
    
    forceCartRefresh(): void {
        const currentItems = this.cartItemsSubject.value;
        this.cartItemsSubject.next([...currentItems]);
        this.updateCartStats();
    }
    
    private calculateTotal(items: CartItem[]): number {
        return items.reduce((total, item) => {
            if (item && item.product && typeof item.product.price === 'number') {
                return total + (item.product.price * item.quantity);
            }
            return total;
        }, 0);
    }
    
    private calculateItemCount(items: CartItem[]): number {
        return items.reduce((count, item) => {
            if (item && typeof item.quantity === 'number') {
                return count + item.quantity;
            }
            return count;
        }, 0);
    }
    
    private dispatchCartUpdatedEvent(): void {
        try {
            const items = this.cartItemsSubject.value;
            const event = new CustomEvent('cartUpdated', {
                detail: {
                    timestamp: new Date().toISOString(),
                    itemCount: this.calculateItemCount(items),
                    total: this.calculateTotal(items),
                    itemsCount: items.length
                }
            });
            window.dispatchEvent(event);
        } catch (eventError: any) {
            console.error('Error dispatching cart event:', eventError);
        }
    }
}