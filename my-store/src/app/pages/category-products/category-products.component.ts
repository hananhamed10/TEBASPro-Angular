import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category-products',
  templateUrl: './category-products.component.html'
})
export class CategoryProductsComponent implements OnInit {
  categoryId: string = '';
  category: any = {};
  products: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCategoryProducts();
  }

  loadCategoryProducts() {

    const category = this.categoryService.getCategoryById(parseInt(this.categoryId));
    
    if (category) {
      this.category = {
        name: category.name,
        description: category.description
      };
      this.products = category.products; 
    } else {

      this.category = {
        name: 'Category ' + this.categoryId,
        description: 'Category not found'
      };
      this.products = [];
    }
    
    console.log('Category products loaded:', this.products);
  }

  addToCart(product: any) {
    console.log('Added to cart:', product.name);
  }
}