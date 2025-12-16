import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, retry, catchError } from 'rxjs/operators';

export interface WishlistItem {
  id: string;
  product: any;
  addedDate: string;
}

export interface WishlistResponse {
  success: boolean;
  message?: string;
  data?: any;
  action?: 'added' | 'removed'; 
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private storageKey = 'wishlist_items';
  private maxRetries = 3;

  constructor() {}

  getWishlist(): Observable<WishlistItem[]> {
    return new Observable<WishlistItem[]>(observer => {
      try {
        const wishlistStr = localStorage.getItem(this.storageKey);
        
        if (!wishlistStr) {
          observer.next([]);
          observer.complete();
          return;
        }
        
        const items = JSON.parse(wishlistStr);
        
     
        const validatedItems = this.validateWishlistItems(items);
        
        setTimeout(() => {
          observer.next(validatedItems);
          observer.complete();
        }, 150);
        
      } catch (error) {
        console.error('Error loading wishlist:', error);
        
        setTimeout(() => {
          observer.next([]);
          observer.complete();
        }, 150);
      }
    }).pipe(
      retry(this.maxRetries),
      catchError(error => {
        console.error('Max retries reached for wishlist:', error);
        return of([]);
      })
    );
  }

  addToWishlist(product: any): Observable<WishlistResponse> {
    return new Observable<WishlistResponse>(observer => {
      try {
      
        if (!product || !product.id) {
          observer.next({ 
            success: false, 
            message: 'Invalid product data' 
          });
          observer.complete();
          return;
        }
        
        const wishlist = this.getWishlistFromStorage();
        const existingIndex = wishlist.findIndex(item => item.id === product.id.toString());
        
        if (existingIndex === -1) {
          const wishlistItem: WishlistItem = {
            id: product.id.toString(),
            product: {
              id: product.id,
              name: product.name || 'Unknown Product',
              description: product.description || '',
              price: product.price || 0,
              originalPrice: product.originalPrice || product.price || 0,
              image: product.image || product.images?.[0] || null,
              images: product.images || [],
              stock: product.stock || 0,
              rating: product.rating || 0,
              category: product.category || 'Uncategorized',
              sku: product.sku || '',
              brand: product.brand || ''
            },
            addedDate: new Date().toISOString()
          };
          
          wishlist.push(wishlistItem);
          this.saveWishlist(wishlist);
          
          setTimeout(() => {
            observer.next({ 
              success: true, 
              message: 'Added to wishlist successfully',
              data: wishlistItem
            });
            observer.complete();
          }, 200);
        } else {
          setTimeout(() => {
            observer.next({ 
              success: false, 
              message: 'Product is already in wishlist' 
            });
            observer.complete();
          }, 200);
        }
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to add to wishlist. Please try again.' 
          });
          observer.complete();
        }, 200);
      }
    });
  }

  removeFromWishlist(productId: string): Observable<WishlistResponse> {
    return new Observable<WishlistResponse>(observer => {
      try {
        if (!productId) {
          observer.next({ 
            success: false, 
            message: 'Product ID is required' 
          });
          observer.complete();
          return;
        }
        
        const wishlist = this.getWishlistFromStorage();
        const initialLength = wishlist.length;
        const filteredWishlist = wishlist.filter(item => item.id !== productId.toString());
        
        if (filteredWishlist.length === initialLength) {
          // Item not found
          setTimeout(() => {
            observer.next({ 
              success: false, 
              message: 'Product not found in wishlist' 
            });
            observer.complete();
          }, 200);
        } else {
          this.saveWishlist(filteredWishlist);
          
          setTimeout(() => {
            observer.next({ 
              success: true, 
              message: 'Removed from wishlist successfully' 
            });
            observer.complete();
          }, 200);
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to remove from wishlist' 
          });
          observer.complete();
        }, 200);
      }
    });
  }

  clearWishlist(): Observable<WishlistResponse> {
    return new Observable<WishlistResponse>(observer => {
      try {
        const wishlist = this.getWishlistFromStorage();
        const itemCount = wishlist.length;
        
        if (itemCount === 0) {
          observer.next({ 
            success: false, 
            message: 'Wishlist is already empty' 
          });
          observer.complete();
          return;
        }
        
        localStorage.removeItem(this.storageKey);
        
        setTimeout(() => {
          observer.next({ 
            success: true, 
            message: `Cleared ${itemCount} items from wishlist`,
            data: { count: itemCount }
          });
          observer.complete();
        }, 200);
      } catch (error) {
        console.error('Error clearing wishlist:', error);
        
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to clear wishlist' 
          });
          observer.complete();
        }, 200);
      }
    });
  }

  isInWishlist(productId: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      try {
        const wishlist = this.getWishlistFromStorage();
        const exists = wishlist.some(item => item.id === productId.toString());
        
        observer.next(exists);
        observer.complete();
      } catch (error) {
        console.error('Error checking wishlist:', error);
        observer.next(false);
        observer.complete();
      }
    });
  }

  toggleWishlist(product: any): Observable<WishlistResponse> {
    return new Observable<WishlistResponse>(observer => {
      this.isInWishlist(product.id).subscribe({
        next: (isInWishlist) => {
          if (isInWishlist) {
            this.removeFromWishlist(product.id).subscribe({
              next: (response) => {
                observer.next({ 
                  ...response, 
                  action: 'removed' 
                });
                observer.complete();
              }
            });
          } else {
            this.addToWishlist(product).subscribe({
              next: (response) => {
                observer.next({ 
                  ...response, 
                  action: 'added' 
                });
                observer.complete();
              }
            });
          }
        }
      });
    });
  }

  getWishlistCount(): Observable<number> {
    return new Observable<number>(observer => {
      try {
        const wishlist = this.getWishlistFromStorage();
        observer.next(wishlist.length);
        observer.complete();
      } catch (error) {
        console.error('Error getting wishlist count:', error);
        observer.next(0);
        observer.complete();
      }
    });
  }

  getWishlistItems(): WishlistItem[] {
    return this.getWishlistFromStorage();
  }

  // Helper Methods
  private getWishlistFromStorage(): WishlistItem[] {
    try {
      const wishlistStr = localStorage.getItem(this.storageKey);
      if (!wishlistStr) return [];
      
      const items = JSON.parse(wishlistStr);
      return this.validateWishlistItems(items);
    } catch (error) {
      console.error('Error parsing wishlist:', error);
      return [];
    }
  }

  private saveWishlist(wishlist: WishlistItem[]): void {
    try {
      const validatedWishlist = this.validateWishlistItems(wishlist);
      localStorage.setItem(this.storageKey, JSON.stringify(validatedWishlist));
      
      // Dispatch custom event for other components
      window.dispatchEvent(new CustomEvent('wishlistUpdated', {
        detail: { count: validatedWishlist.length }
      }));
    } catch (error) {
      console.error('Error saving wishlist:', error);
      throw error;
    }
  }

  private validateWishlistItems(items: any[]): WishlistItem[] {
    if (!Array.isArray(items)) return [];
    
    return items.filter(item => {
      // Basic validation
      return item && 
             typeof item === 'object' &&
             item.id &&
             item.product &&
             item.addedDate;
    }).map(item => ({
      id: item.id.toString(),
      product: {
        id: item.product.id || item.id,
        name: item.product.name || 'Unknown Product',
        description: item.product.description || '',
        price: Number(item.product.price) || 0,
        originalPrice: Number(item.product.originalPrice) || Number(item.product.price) || 0,
        image: item.product.image || item.product.images?.[0] || null,
        images: item.product.images || [],
        stock: Number(item.product.stock) || 0,
        rating: Number(item.product.rating) || 0,
        category: item.product.category || 'Uncategorized',
        sku: item.product.sku || '',
        brand: item.product.brand || ''
      },
      addedDate: item.addedDate || new Date().toISOString()
    }));
  }

  // Mock data for testing/development
  getMockWishlist(): WishlistItem[] {
    return [
      {
        id: '1',
        product: {
          id: '1',
          name: 'Wireless Noise-Cancelling Headphones',
          description: 'Premium headphones with active noise cancellation and 30-hour battery life',
          price: 249.99,
          originalPrice: 299.99,
          image: 'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Headphones',
          images: [
            'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Headphones-1',
            'https://via.placeholder.com/300x300/4A90E2/FFFFFF?text=Headphones-2'
          ],
          stock: 25,
          rating: 4.5,
          category: 'Electronics',
          sku: 'HP-WNC-001',
          brand: 'AudioTech'
        },
        addedDate: new Date().toISOString()
      },
      {
        id: '2',
        product: {
          id: '2',
          name: 'Smart Fitness Watch',
          description: 'Waterproof fitness tracker with heart rate monitor and GPS',
          price: 189.99,
          originalPrice: 229.99,
          image: 'https://via.placeholder.com/300x300/50E3C2/FFFFFF?text=Smart+Watch',
          images: [
            'https://via.placeholder.com/300x300/50E3C2/FFFFFF?text=Watch-1',
            'https://via.placeholder.com/300x300/50E3C2/FFFFFF?text=Watch-2'
          ],
          stock: 8,
          rating: 4.2,
          category: 'Wearables',
          sku: 'SW-FIT-002',
          brand: 'FitTrack'
        },
        addedDate: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '3',
        product: {
          id: '3',
          name: 'Wireless Keyboard & Mouse Combo',
          description: 'Ergonomic wireless keyboard and mouse set with long battery life',
          price: 79.99,
          originalPrice: 99.99,
          image: 'https://via.placeholder.com/300x300/9013FE/FFFFFF?text=Keyboard+Mouse',
          images: [],
          stock: 0,
          rating: 4.0,
          category: 'Computer Accessories',
          sku: 'KM-WRL-003',
          brand: 'TechGear'
        },
        addedDate: new Date(Date.now() - 172800000).toISOString()
      }
    ];
  }

 
  populateMockData(): void {
    if (!localStorage.getItem(this.storageKey)) {
      const mockData = this.getMockWishlist();
      localStorage.setItem(this.storageKey, JSON.stringify(mockData));
      console.log('Mock wishlist data populated');
    }
  }

 
  exportWishlist(): string {
    try {
      const wishlist = this.getWishlistFromStorage();
      return JSON.stringify(wishlist, null, 2);
    } catch (error) {
      console.error('Error exporting wishlist:', error);
      return '';
    }
  }

 
  importWishlist(data: string): Observable<WishlistResponse> {
    return new Observable<WishlistResponse>(observer => {
      try {
        const importedData = JSON.parse(data);
        
        if (!Array.isArray(importedData)) {
          observer.next({
            success: false,
            message: 'Invalid wishlist data format'
          });
          observer.complete();
          return;
        }
        
        const validatedData = this.validateWishlistItems(importedData);
        this.saveWishlist(validatedData);
        
        setTimeout(() => {
          observer.next({
            success: true,
            message: `Successfully imported ${validatedData.length} items`,
            data: { count: validatedData.length }
          });
          observer.complete();
        }, 300);
      } catch (error) {
        console.error('Error importing wishlist:', error);
        
        setTimeout(() => {
          observer.next({
            success: false,
            message: 'Failed to import wishlist data'
          });
          observer.complete();
        }, 300);
      }
    });
  }
}