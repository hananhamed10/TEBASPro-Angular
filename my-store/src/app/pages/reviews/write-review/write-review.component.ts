import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewPage implements OnInit {
  reviewForm: FormGroup;
  productId: string = '';
  rating = 0;
  submitting = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reviewService: ReviewService,
    private notificationService: NotificationService
  ) {
    this.reviewForm = this.fb.group({
      title: ['', Validators.required],
      comment: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.productId = this.route.snapshot.queryParamMap.get('productId') || '';
  }

  setRating(stars: number) {
    this.rating = stars;
  }

  submitReview() {
    if (this.reviewForm.invalid || this.rating === 0) {
      this.notificationService.showError('Please fill all required fields');
      return;
    }

    this.submitting = true;
    
    const reviewData = {
      ...this.reviewForm.value,
      rating: this.rating,
      productId: this.productId
    };

    this.reviewService.submitReview(reviewData).subscribe({
      next: (response: any) => {
        this.submitting = false;
        this.notificationService.showSuccess('Review submitted successfully!');
        this.router.navigate(['/product', this.productId, 'reviews']);
      },
      error: (error: any) => {
        this.submitting = false;
        this.notificationService.showError('Error submitting review');
      }
    });
  }
}