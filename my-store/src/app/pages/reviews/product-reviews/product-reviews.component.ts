import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../../core/services/review.service';

@Component({
  selector: 'app-product-reviews',
  templateUrl: './product-reviews.component.html',
  styleUrls: ['./product-reviews.component.scss']
})
export class ProductReviewsPage implements OnInit {
  productId: string = '';
  reviews: any[] = [];
  averageRating = 0;
  loading = true;
  selectedRating?: number;

  constructor(
    private route: ActivatedRoute,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    this.loadReviews();
  }

  loadReviews() {
    this.loading = true;
    this.selectedRating = undefined;
    
    this.reviewService.getProductReviews(this.productId).subscribe({
      next: (data: any) => {
        this.reviews = data.reviews;
        this.averageRating = data.averageRating;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  filterByRating(rating: number) {
    this.loading = true;
    this.selectedRating = rating;
    
    this.reviewService.getProductReviews(this.productId, rating).subscribe({
      next: (data: any) => {
        this.reviews = data.reviews;
        this.loading = false;
      }
    });
  }
}