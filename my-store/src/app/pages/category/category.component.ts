import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.categories = this.categoryService.getCategories();
  }

  // وظيفة Edit
  editCategory(category: any) {
    console.log('Editing category:', category.name);
    // هنا هتفتحي modal أو تروحي لصفحة التعديل
    // this.router.navigate(['/categories', category.id, 'edit']);
  }

  // وظيفة Delete
  deleteCategory(category: any) {
    if (confirm(`Are you sure you want to delete ${category.name}?`)) {
      console.log('Deleting category:', category.name);
      // هنا هتعملي delete request للباك-end
      // this.categoryService.deleteCategory(category.id).subscribe(...);
    }
  }
}