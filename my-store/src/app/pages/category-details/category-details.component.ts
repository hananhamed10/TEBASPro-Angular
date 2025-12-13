import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html'
})
export class CategoryDetailsComponent implements OnInit {
  categoryId: string = '';
  category: any = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id') || '';
    this.loadCategoryDetails();
  }

  loadCategoryDetails() {
    const categoryDetails: any = {
      '1': {
        id: 1,
        name: 'Electronics',
        description: 'Discover the latest in technology',
        longDescription: 'Our electronics category features cutting-edge technology from leading brands. From smartphones to laptops, we offer the latest innovations to keep you connected and productive. All products come with warranty and excellent customer support.',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=400&fit=crop',
        features: ['Latest Technology', 'Warranty Included', 'Fast Shipping', 'Expert Support'],
        stats: { totalProducts: 45, established: 2018, satisfactionRate: 97 }
      },
      '2': {
        id: 2,
        name: 'Fashion',
        description: 'Style for every occasion',
        longDescription: 'Express your unique style with our fashion collection. From casual wear to formal attire, we offer high-quality clothing and accessories for all tastes. Our fashion experts curate the latest trends to keep you looking fabulous.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=400&fit=crop',
        features: ['Latest Trends', 'Premium Quality', 'Size Variety', 'Easy Returns'],
        stats: { totalProducts: 78, established: 2015, satisfactionRate: 95 }
      },
      '3': {
        id: 3,
        name: 'Home & Garden',
        description: 'Create your perfect space',
        longDescription: 'Transform your living spaces with our home and garden collection. From furniture to decor, we offer everything you need to create a comfortable and beautiful home. Quality craftsmanship meets modern design in every product.',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop',
        features: ['Quality Materials', 'Modern Designs', 'Easy Assembly', 'Eco-Friendly'],
        stats: { totalProducts: 32, established: 2019, satisfactionRate: 96 }
      },
      '4': {
        id: 4,
        name: 'Sports',
        description: 'Gear up for adventure',
        longDescription: 'Achieve your fitness goals with our premium sports equipment. From professional gear to casual workout essentials, we have everything for athletes and fitness enthusiasts. Quality and durability guaranteed.',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop',
        features: ['Professional Grade', 'Durable Materials', 'Performance Focused', 'Expert Advice'],
        stats: { totalProducts: 23, established: 2017, satisfactionRate: 94 }
      },
      '5': {
        id: 5,
        name: 'Books',
        description: 'Expand your knowledge',
        longDescription: 'Dive into worlds of knowledge and imagination with our extensive book collection. From bestsellers to educational materials, we offer books for every reader. Knowledge is power, and we make it accessible to all.',
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=400&fit=crop',
        features: ['Wide Selection', 'Educational Content', 'Fast Delivery', 'Gift Options'],
        stats: { totalProducts: 156, established: 2014, satisfactionRate: 98 }
      },
      '6': {
        id: 6,
        name: 'Beauty',
        description: 'Enhance your natural beauty',
        longDescription: 'Discover your beauty potential with our premium skincare and makeup products. From daily essentials to luxury treatments, we offer products that make you look and feel amazing. All products are cruelty-free and tested.',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop',
        features: ['Cruelty-Free', 'Premium Ingredients', 'Expert Curated', 'Skin Safe'],
        stats: { totalProducts: 67, established: 2019, satisfactionRate: 96 }
      },
      '7': {
        id: 7,
        name: 'Toys & Games',
        description: 'Fun for all ages',
        longDescription: 'Spark creativity and joy with our amazing toys and games collection. From educational toys for children to challenging games for adults, we have something for everyone. Quality and safety are our top priorities.',
        image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=400&fit=crop',
        features: ['Educational Value', 'Safe Materials', 'Age Appropriate', 'Family Fun'],
        stats: { totalProducts: 89, established: 2018, satisfactionRate: 97 }
      },
      '8': {
        id: 8,
        name: 'Health & Wellness',
        description: 'Invest in your well-being',
        longDescription: 'Prioritize your health with our comprehensive wellness products. From supplements to fitness equipment, we support your journey to better health. All products are carefully selected for quality and effectiveness.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
        features: ['Quality Supplements', 'Fitness Equipment', 'Wellness Focus', 'Health Experts'],
        stats: { totalProducts: 54, established: 2020, satisfactionRate: 95 }
      },
      '9': {
        id: 9,
        name: 'Automotive',
        description: 'Upgrade your ride',
        longDescription: 'Enhance your driving experience with our premium automotive products. From maintenance essentials to stylish accessories, we have everything to keep your vehicle in top condition. Quality parts for smooth rides.',
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop',
        features: ['Premium Parts', 'Easy Installation', 'Vehicle Care', 'Expert Support'],
        stats: { totalProducts: 41, established: 2016, satisfactionRate: 93 }
      },
      '10': {
        id: 10,
        name: 'Food & Beverages',
        description: 'Taste the excellence',
        longDescription: 'Indulge in gourmet experiences with our premium food and beverage selection. From exotic spices to fine wines, we bring world flavors to your table. Quality ingredients for memorable meals.',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=400&fit=crop',
        features: ['Gourmet Quality', 'Fresh Ingredients', 'International Selection', 'Recipe Ideas'],
        stats: { totalProducts: 112, established: 2015, satisfactionRate: 97 }
      },
      '11': {
        id: 11,
        name: 'Jewelry',
        description: 'Elegance that lasts',
        longDescription: 'Adorn yourself with timeless elegance from our jewelry collection. From classic pieces to modern designs, we offer quality jewelry that tells your story. Each piece is crafted with precision and care.',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
        features: ['Precious Metals', 'Gemstone Quality', 'Expert Craftsmanship', 'Lifetime Care'],
        stats: { totalProducts: 38, established: 2013, satisfactionRate: 99 }
      },
      '12': {
        id: 12,
        name: 'Pet Supplies',
        description: 'Love in every product',
        longDescription: 'Keep your pets happy and healthy with our premium pet supplies. From nutrition to toys, we offer everything your pets need for a comfortable life. All products are vet-approved and pet-safe.',
        image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=400&fit=crop',
        features: ['Vet-Approved', 'Premium Nutrition', 'Safe Materials', 'Happy Pets'],
        stats: { totalProducts: 76, established: 2020, satisfactionRate: 98 }
      }
    };

    this.category = categoryDetails[this.categoryId] || {
      id: this.categoryId,
      name: 'Category ' + this.categoryId,
      description: 'Category description',
      longDescription: 'Detailed description about this category...',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
      features: ['Quality Products', 'Great Service', 'Fast Shipping'],
      stats: { totalProducts: 25, established: 2020, satisfactionRate: 95 }
    };
  }
}