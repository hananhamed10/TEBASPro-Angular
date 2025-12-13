import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private storageKey = 'product_reviews';

  constructor() {}

  getProductReviews(productId: string, rating?: number): Observable<any> {
    const allReviews = this.getReviewsFromStorage();
    let productReviews = allReviews.filter(review => review.productId === productId);
    
    if (rating) {
      productReviews = productReviews.filter(review => review.rating === rating);
    }
    
    const averageRating = this.calculateAverageRating(productReviews);
    const ratingDistribution = this.calculateRatingDistribution(productReviews);
    
    return of({
      reviews: productReviews,
      averageRating: averageRating,
      ratingDistribution: ratingDistribution,
      totalReviews: productReviews.length
    });
  }

  submitReview(reviewData: any): Observable<any> {
    const reviews = this.getReviewsFromStorage();
    const newReview = {
      id: 'REV-' + Date.now(),
      ...reviewData,
      date: new Date().toISOString(),
      user: {
        name: 'Current User',
        avatar: 'assets/images/avatar.jpg',
        verified: true
      },
      helpful: 0
    };
    
    reviews.push(newReview);
    this.saveReviews(reviews);
    
    return of({ success: true, review: newReview });
  }

  getUserReviews(): Observable<any[]> {
    const reviews = this.getReviewsFromStorage();
    // For demo, return all reviews
    return of(reviews);
  }

  markHelpful(reviewId: string): Observable<any> {
    const reviews = this.getReviewsFromStorage();
    const review = reviews.find(r => r.id === reviewId);
    
    if (review) {
      review.helpful = (review.helpful || 0) + 1;
      this.saveReviews(reviews);
    }
    
    return of({ success: true });
  }

  private getReviewsFromStorage(): any[] {
    const reviews = localStorage.getItem(this.storageKey);
    if (reviews) {
      return JSON.parse(reviews);
    }
    
    // Generate sample reviews for demo
    const sampleReviews = this.generateSampleReviews();
    this.saveReviews(sampleReviews);
    return sampleReviews;
  }

  private saveReviews(reviews: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(reviews));
  }

  private calculateAverageRating(reviews: any[]): number {
    if (reviews.length === 0) return 0;
    
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return parseFloat((total / reviews.length).toFixed(1));
  }

  private calculateRatingDistribution(reviews: any[]): any {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++;
      }
    });
    
    return distribution;
  }

  private generateSampleReviews(): any[] {
    return [
      {
        id: 'REV-1',
        productId: 'p1',
        productName: 'Wireless Headphones',
        rating: 5,
        title: 'Excellent Sound Quality!',
        comment: 'These headphones have amazing sound quality and the battery life is incredible. Very comfortable for long listening sessions.',
        date: '2024-01-10T14:30:00Z',
        user: {
          name: 'Alex Johnson',
          avatar: 'assets/images/avatar1.jpg',
          verified: true
        },
        helpful: 12,
        images: ['assets/images/review1-1.jpg', 'assets/images/review1-2.jpg']
      },
      {
        id: 'REV-2',
        productId: 'p1',
        productName: 'Wireless Headphones',
        rating: 4,
        title: 'Good value for money',
        comment: 'Great headphones for the price. Comfortable and good battery life. Noise cancellation could be better though.',
        date: '2024-01-15T10:20:00Z',
        user: {
          name: 'Sarah Williams',
          avatar: 'assets/images/avatar2.jpg',
          verified: true
        },
        helpful: 5
      },
      {
        id: 'REV-3',
        productId: 'p2',
        productName: 'Smart Watch',
        rating: 5,
        title: 'Perfect fitness companion',
        comment: 'This watch tracks all my workouts accurately. Love the heart rate monitor and sleep tracking features.',
        date: '2024-01-18T16:45:00Z',
        user: {
          name: 'Mike Brown',
          avatar: 'assets/images/avatar3.jpg',
          verified: true
        },
        helpful: 8
      },
      {
        id: 'REV-4',
        productId: 'p2',
        productName: 'Smart Watch',
        rating: 3,
        title: 'Good but battery could be better',
        comment: 'Features are good but battery only lasts 2 days with heavy use. Charging is fast though.',
        date: '2024-01-22T11:10:00Z',
        user: {
          name: 'Emily Chen',
          avatar: 'assets/images/avatar4.jpg',
          verified: false
        },
        helpful: 2
      }
    ];
  }
}