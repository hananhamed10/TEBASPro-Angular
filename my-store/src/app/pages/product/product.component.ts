import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
   // ← تأكدي إن ده اسم الملف الصح
  styleUrls: ['./product.component.scss']  // ← تأكدي إن ده اسم الملف الصح
})
export class ProductComponent implements OnInit {
  products: any[] = [];
  
  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  loadAllProducts() {
    const allCategories = this.categoryService.getCategories();
    
    this.products = allCategories.flatMap(category =>category.products.map(product => ({
        ...product,
        categoryName: category.name,
        categoryId: category.id
      }))
    );

    console.log('All products loaded:', this.products.length);
  }

  addToCart(product: any) {
    console.log('Added to cart:', product.name);
  }

  getProductsByCategory(categoryId: number) {
    return this.products.filter(product => product.categoryId === categoryId);
  }
}