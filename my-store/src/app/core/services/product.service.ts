
import { Injectable } from '@angular/core';
import { Product } from '../../core/models/model'

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = [
    // ========== ELECTRONICS ==========
    {
      id: 101,
      name: 'Wireless Headphones Pro',
      description: 'Premium noise-cancelling wireless headphones with 30-hour battery life and superior sound quality for immersive audio experience',
      price: 199.99,
      originalPrice: 249.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 15,
      features: ['Active Noise Cancellation', '30-hour Battery Life', 'Bluetooth 5.0', 'Comfort Fit Ear Cups', 'Voice Assistant Support'],
      specifications: { 
        'Battery Life': '30 hours', 
        'Connectivity': 'Bluetooth 5.0', 
        'Weight': '250g',
        'Charging Time': '2 hours',
        'Warranty': '2 years'
      },
      rating: 4.5,
      reviews: 128,
      inStock: true,
      isFeatured: true
    },
    {
      id: 102,
      name: 'Smartphone Pro Max',
      description: 'Flagship smartphone with advanced triple camera system, all-day battery life, and stunning OLED display',
      price: 899.99,
      originalPrice: 999.99,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 8,
      features: ['Triple Camera System', '5G Connectivity', '128GB Storage', 'All-day Battery', 'Face Recognition'],
      specifications: { 
        'Screen': '6.1" OLED', 
        'Storage': '128GB', 
        'Camera': '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
        'Processor': 'A15 Bionic',
        'Operating System': 'iOS 16'
      },
      rating: 4.8,
      reviews: 256,
      inStock: true,
      isFeatured: true
    },
    {
      id: 103,
      name: 'Laptop Ultra Pro',
      description: 'Powerful ultrabook with high-performance processor, stunning 4K display, and all-day battery for work and creativity',
      price: 1299.99,
      originalPrice: 1499.99,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 6,
      features: ['Intel i7 Processor', '16GB RAM', '512GB SSD', '14" 4K Display', 'Thunderbolt 4'],
      specifications: { 
        'Processor': 'Intel Core i7-1260P', 
        'RAM': '16GB LPDDR5', 
        'Storage': '512GB NVMe SSD',
        'Display': '14" 4K UHD',
        'Graphics': 'Intel Iris Xe'
      },
      rating: 4.7,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 104,
      name: 'Smart Watch Series 5',
      description: 'Advanced smartwatch with comprehensive fitness tracking, heart rate monitoring, and seamless smartphone integration',
      price: 299.99,
      originalPrice: 349.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 20,
      features: ['Fitness Tracking', 'Heart Rate Monitor', 'Water Resistant', '7-day Battery', 'GPS'],
      specifications: { 
        'Battery': '7 days', 
        'Water Resistance': '50m', 
        'Display': '1.4" AMOLED',
        'Connectivity': 'Bluetooth 5.2',
        'Sensors': 'Heart Rate, SpO2, GPS'
      },
      rating: 4.4,
      reviews: 312,
      inStock: true,
      isFeatured: true
    },
    {
      id: 105,
      name: 'Tablet Pro 12.9"',
      description: 'Versatile tablet perfect for entertainment, productivity, and creative work with advanced stylus support',
      price: 499.99,
      originalPrice: 599.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 12,
      features: ['12.9" Display', 'Apple Pencil Support', '256GB Storage', 'All-day Battery', '5G Connectivity'],
      specifications: { 
        'Screen': '12.9" Liquid Retina', 
        'Storage': '256GB', 
        'Battery': '10 hours',
        'Chip': 'M1 Chip',
        'Camera': '12MP Wide + 10MP Ultra Wide'
      },
      rating: 4.6,
      reviews: 167,
      inStock: true,
      isFeatured: false
    },
    {
      id: 106,
      name: 'Wireless Earbuds',
      description: 'True wireless earbuds with active noise cancellation and premium sound quality',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=500&h=500&fit=crop',
      category: 'Electronics',
      categoryId: 1,
      stock: 25,
      features: ['Active Noise Cancellation', '24-hour Battery', 'Wireless Charging', 'Sweat Resistant'],
      specifications: { 
        'Battery': '6 hours (24 with case)', 
        'Connectivity': 'Bluetooth 5.2', 
        'Weight': '5g per earbud'
      },
      rating: 4.3,
      reviews: 89,
      inStock: true,
      isFeatured: false
    },

    // ========== FASHION ==========
    {
      id: 201,
      name: 'Designer Silk Dress',
      description: 'Elegant evening dress made from premium silk with intricate detailing for special occasions',
      price: 189.99,
      originalPrice: 229.99,
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=500&fit=crop',
      category: 'Fashion',
      categoryId: 2,
      stock: 12,
      features: ['Premium Silk', 'Elegant Design', 'Comfortable Fit', 'Handcrafted Details', 'Dry Clean Only'],
      specifications: { 
        'Material': '100% Pure Silk', 
        'Color': 'Navy Blue', 
        'Sizes': 'XS, S, M, L, XL',
        'Care': 'Dry Clean Only',
        'Origin': 'Italy'
      },
      rating: 4.6,
      reviews: 89,
      inStock: true,
      isFeatured: true
    },
    {
      id: 202,
      name: 'Premium Running Sneakers',
      description: 'High-performance running sneakers with advanced cushioning technology for maximum comfort',
      price: 129.99,
      originalPrice: 159.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop',
      category: 'Fashion',
      categoryId: 2,
      stock: 25,
      features: ['Advanced Cushioning', 'Breathable Material', 'Durable Sole', 'Multiple Colors', 'Lightweight'],
      specifications: { 
        'Material': 'Engineered Mesh & Leather', 
        'Sizes': '6-12 (US)', 
        'Colors': '5 options available',
        'Weight': '280g',
        'Technology': 'Air Cushioning'
      },
      rating: 4.5,
      reviews: 234,
      inStock: true,
      isFeatured: false
    },
    {
      id: 203,
      name: 'Classic Leather Jacket',
      description: 'Timeless leather jacket crafted from genuine leather with premium craftsmanship',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop',
      category: 'Fashion',
      categoryId: 2,
      stock: 8,
      features: ['Genuine Leather', 'Classic Design', 'Comfortable Fit', 'Durable Construction', 'Multiple Pockets'],
      specifications: { 
        'Material': 'Genuine Cowhide Leather', 
        'Sizes': 'S, M, L, XL, XXL', 
        'Color': 'Classic Black',
        'Lining': '100% Cotton',
        'Hardware': 'YKK Zippers'
      },
      rating: 4.7,
      reviews: 156,
      inStock: true,
      isFeatured: true
    },
    {
      id: 204,
      name: 'Luxury Leather Handbag',
      description: 'Sophisticated handbag with multiple compartments and premium leather construction',
      price: 249.99,
      originalPrice: 299.99,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&h=500&fit=crop',
      category: 'Fashion',
      categoryId: 2,
      stock: 15,
      features: ['Premium Leather', 'Multiple Compartments', 'Adjustable Strap', 'Secure Closure', 'Gold Hardware'],
      specifications: { 
        'Material': 'Genuine Calfskin Leather', 
        'Dimensions': '12" x 8" x 5"', 
        'Color': 'Chestnut Brown',
        'Strap Length': 'Adjustable 22-28"',
        'Closure': 'Magnetic Snap'
      },
      rating: 4.8,
      reviews: 201,
      inStock: true,
      isFeatured: false
    },
    {
      id: 205,
      name: 'Designer Sunglasses',
      description: 'Premium sunglasses with UV protection and polarized lenses for style and eye protection',
      price: 159.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop',
      category: 'Fashion',
      categoryId: 2,
      stock: 30,
      features: ['UV400 Protection', 'Polarized Lenses', 'Lightweight Frame', 'Designer Brand', 'Case Included'],
      specifications: { 
        'Lens Type': 'Polarized', 
        'UV Protection': '100% UV400', 
        'Frame Material': 'Acetate',
        'Lens Material': 'Polycarbonate'
      },
      rating: 4.4,
      reviews: 167,
      inStock: true,
      isFeatured: false
    },

    // ========== HOME & GARDEN ==========
    {
      id: 301,
      name: 'Modern 3-Piece Sofa Set',
      description: 'Contemporary 3-piece sofa set with premium upholstery and comfortable cushions for modern living spaces',
      price: 899.99,
      originalPrice: 1099.99,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      categoryId: 3,
      stock: 5,
      features: ['3-Piece Set', 'Premium Upholstery', 'Comfortable Cushions', 'Easy Assembly', 'Modern Design'],
      specifications: { 
        'Material': 'Premium Fabric', 
        'Color': 'Charcoal Grey', 
        'Dimensions': 'L-shaped: 86" x 64"',
        'Weight Capacity': '300kg per seat',
        'Assembly': 'Required (tools included)'
      },
      rating: 4.6,
      reviews: 78,
      inStock: true,
      isFeatured: true
    },
    {
      id: 302,
      name: 'Automatic Coffee Maker',
      description: 'Programmable coffee maker with built-in grinder and thermal carafe for perfect coffee every time',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      categoryId: 3,
      stock: 18,
      features: ['Programmable Timer', 'Built-in Grinder', '12-cup Capacity', 'Auto Shut-off', 'Thermal Carafe'],
      specifications: { 
        'Capacity': '12 cups (1.8L)', 
        'Features': 'Programmable, Grinder', 
        'Color': 'Stainless Steel',
        'Power': '1000W',
        'Warranty': '2 years'
      },
      rating: 4.4,
      reviews: 145,
      inStock: true,
      isFeatured: false
    },
    {
      id: 303,
      name: 'Professional Garden Tools Set',
      description: 'Complete 10-piece gardening tool set with durable steel construction and comfortable grips',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      categoryId: 3,
      stock: 30,
      features: ['10-Piece Set', 'Durable Steel', 'Comfortable Handles', 'Storage Case', 'Rust Resistant'],
      specifications: { 
        'Pieces': '10 tools', 
        'Material': 'Carbon Steel', 
        'Storage': 'Carrying Case Included',
        'Handle Material': 'Rubberized Grip'
      },
      rating: 4.5,
      reviews: 89,
      inStock: true,
      isFeatured: false
    },
    {
      id: 304,
      name: 'Modern Canvas Wall Art',
      description: 'Beautiful canvas wall art with contemporary design to enhance your home decor and living space',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      categoryId: 3,
      stock: 22,
      features: ['Canvas Print', 'Modern Design', 'Ready to Hang', 'Multiple Sizes', 'Fade Resistant'],
      specifications: { 
        'Material': 'Premium Canvas', 
        'Size': '24" x 36"', 
        'Frame': 'Wooden Stretcher Frame Included',
        'Print Type': 'HD Giclee Print'
      },
      rating: 4.7,
      reviews: 112,
      inStock: true,
      isFeatured: true
    },
    {
      id: 305,
      name: 'Smart LED Lighting Kit',
      description: 'WiFi enabled smart LED lighting kit with color changing options and voice control compatibility',
      price: 69.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25856cd63?w=500&h=500&fit=crop',
      category: 'Home & Garden',
      categoryId: 3,
      stock: 40,
      features: ['WiFi Enabled', 'Color Changing', 'Voice Control', 'App Control', 'Dimmable'],
      specifications: { 
        'Connectivity': 'WiFi 2.4GHz', 
        'Colors': '16 Million', 
        'Compatibility': 'Alexa, Google Home',
        'Power': '12V DC'
      },
      rating: 4.3,
      reviews: 201,
      inStock: true,
      isFeatured: false
    },

    // ========== SPORTS ==========
    {
      id: 401,
      name: 'Premium Yoga Mat',
      description: 'High-quality non-slip yoga mat with excellent cushioning and eco-friendly materials',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop',
      category: 'Sports',
      categoryId: 4,
      stock: 35,
      features: ['Non-slip Surface', 'Excellent Cushioning', 'Eco-friendly', 'Lightweight', 'Carrying Strap'],
      specifications: { 
        'Thickness': '6mm', 
        'Material': 'Natural TPE', 
        'Size': '72" x 24"',
        'Weight': '2.2kg',
        'Eco-Friendly': 'Biodegradable'
      },
      rating: 4.6,
      reviews: 267,
      inStock: true,
      isFeatured: false
    },
    {
      id: 402,
      name: 'Professional Running Shoes',
      description: 'Advanced running shoes with responsive cushioning and breathable design for optimal performance',
      price: 119.99,
      originalPrice: 149.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop',
      category: 'Sports',
      categoryId: 4,
      stock: 28,
      features: ['Advanced Cushioning', 'Breathable Mesh', 'Durable Sole', 'Lightweight', 'Reflective Elements'],
      specifications: { 
        'Type': 'Running Shoes', 
        'Sizes': '7-13 (US)', 
        'Colors': '3 options available',
        'Weight': '280g (size 9)',
        'Drop': '8mm'
      },
      rating: 4.5,
      reviews: 189,
      inStock: true,
      isFeatured: true
    },
    {
      id: 403,
      name: 'Adjustable Dumbbell Set',
      description: 'Space-saving adjustable dumbbell set with quick weight change technology for home workouts',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=500&fit=crop',
      category: 'Sports',
      categoryId: 4,
      stock: 12,
      features: ['Adjustable Weights', 'Compact Design', 'Easy Storage', 'Comfortable Grip', 'Quick Change'],
      specifications: { 
        'Weight Range': '5-25kg per dumbbell', 
        'Material': 'Steel Plates', 
        'Storage': 'Stand Included',
        'Increments': '2.5kg'
      },
      rating: 4.7,
      reviews: 134,
      inStock: true,
      isFeatured: false
    },
    {
      id: 404,
      name: 'Mountain Bike Pro',
      description: 'Professional mountain bike with advanced suspension system and durable frame for off-road adventures',
      price: 499.99,
      originalPrice: 599.99,
      image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500&h=500&fit=crop',
      category: 'Sports',
      categoryId: 4,
      stock: 8,
      features: ['Mountain Bike', '21 Gears', 'Front Suspension', 'Durable Frame', 'Disc Brakes'],
      specifications: { 
        'Type': 'Mountain Bike', 
        'Gears': '21 Speed', 
        'Frame': 'Aluminum Alloy',
        'Wheel Size': '27.5"',
        'Suspension': '100mm Travel'
      },
      rating: 4.6,
      reviews: 78,
      inStock: true,
      isFeatured: true
    },
    {
      id: 405,
      name: 'Swimming Goggles Pro',
      description: 'Professional swimming goggles with anti-fog coating and UV protection for comfortable swimming',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop',
      category: 'Sports',
      categoryId: 4,
      stock: 50,
      features: ['Anti-Fog Coating', 'UV Protection', 'Adjustable Strap', 'Comfort Fit', 'Multiple Colors'],
      specifications: { 
        'Lens Type': 'Polycarbonate', 
        'UV Protection': '100%', 
        'Fit': 'Adjustable Nose Bridge',
        'Seal': 'Silicone'
      },
      rating: 4.4,
      reviews: 156,
      inStock: true,
      isFeatured: false
    },

    // ========== BOOKS ==========
    {
      id: 501,
      name: 'Bestselling Fiction Novel',
      description: 'Award-winning fiction novel that has captivated readers worldwide with its compelling storytelling',
      price: 24.99,
      originalPrice: 29.99,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop',
      category: 'Books',
      categoryId: 5,
      stock: 45,
      features: ['Bestseller', 'Hardcover Edition', '500 Pages', 'Engaging Story', 'Award Winning'],
      specifications: { 
        'Format': 'Hardcover', 
        'Pages': '500', 
        'Language': 'English',
        'Publisher': 'Penguin Random House',
        'ISBN': '978-0-123456-78-9'
      },
      rating: 4.7,
      reviews: 312,
      inStock: true,
      isFeatured: true
    },
    {
      id: 502,
      name: 'World Cuisine Cookbook',
      description: 'Comprehensive cookbook featuring authentic recipes from around the world with step-by-step instructions',
      price: 34.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop',
      category: 'Books',
      categoryId: 5,
      stock: 28,
      features: ['200+ Recipes', 'Color Photos', 'Step-by-Step', 'International Cuisine', 'Hardcover'],
      specifications: { 
        'Recipes': '200+', 
        'Pages': '320', 
        'Format': 'Hardcover',
        'Cuisine Types': 'International',
        'Skill Level': 'All Levels'
      },
      rating: 4.8,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 503,
      name: 'Science Encyclopedia 2024',
      description: 'Updated edition of comprehensive science reference covering all major scientific disciplines with latest discoveries',
      price: 49.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop',
      category: 'Books',
      categoryId: 5,
      stock: 15,
      features: ['Comprehensive Coverage', 'Color Illustrations', 'Educational', 'Updated Edition', 'Hardcover'],
      specifications: { 
        'Pages': '800', 
        'Topics': 'All Sciences', 
        'Format': 'Hardcover',
        'Edition': '2024 Updated',
        'Illustrations': 'Full Color'
      },
      rating: 4.6,
      reviews: 145,
      inStock: true,
      isFeatured: true
    },
    {
      id: 504,
      name: 'Children\'s Storybook Collection',
      description: 'Beautifully illustrated storybook collection for children with engaging stories and valuable moral lessons',
      price: 19.99,
      originalPrice: 24.99,
      image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&h=500&fit=crop',
      category: 'Books',
      categoryId: 5,
      stock: 60,
      features: ['Color Illustrations', 'Educational Content', 'Durable Binding', 'Ages 4-8', 'Moral Lessons'],
      specifications: { 
        'Age Range': '4-8 years', 
        'Pages': '64 per book', 
        'Format': 'Hardcover',
        'Books in Collection': '5',
        'Illustrations': 'Full Color'
      },
      rating: 4.9,
      reviews: 267,
      inStock: true,
      isFeatured: false
    },
    {
      id: 505,
      name: 'Business Strategy Guide',
      description: 'Essential guide to modern business strategy with practical insights and case studies from successful companies',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop',
      category: 'Books',
      categoryId: 5,
      stock: 25,
      features: ['Business Strategy', 'Case Studies', 'Practical Insights', 'Leadership Tips', 'Hardcover'],
      specifications: { 
        'Format': 'Hardcover', 
        'Pages': '350', 
        'Language': 'English',
        'Topics': 'Strategy, Leadership, Management'
      },
      rating: 4.5,
      reviews: 89,
      inStock: true,
      isFeatured: false
    },

    // ========== BEAUTY ==========
    {
      id: 601,
      name: 'Complete Skincare Set',
      description: 'Comprehensive daily skincare routine set with natural ingredients suitable for all skin types',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      category: 'Beauty',
      categoryId: 6,
      stock: 35,
      features: ['Natural Ingredients', 'Complete Routine', 'All Skin Types', 'Cruelty-Free', 'Dermatologist Tested'],
      specifications: { 
        'Products': '5 items (Cleanser, Toner, Serum, Moisturizer, Sunscreen)', 
        'Skin Type': 'All Types', 
        'Volume': 'Full Size Products',
        'Cruelty-Free': 'Yes',
        'Paraben-Free': 'Yes'
      },
      rating: 4.5,
      reviews: 178,
      inStock: true,
      isFeatured: true
    },
    {
      id: 602,
      name: 'Luxury Fragrance Collection',
      description: 'Elegant fragrance with sophisticated notes of floral and musk for a lasting scent experience',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500&h=500&fit=crop',
      category: 'Beauty',
      categoryId: 6,
      stock: 22,
      features: ['Long-lasting', 'Elegant Scent', 'Premium Bottle', 'Unisex', 'Eau de Parfum'],
      specifications: { 
        'Size': '100ml', 
        'Scent': 'Floral Musk', 
        'Gender': 'Unisex',
        'Concentration': 'Eau de Parfum',
        'Longevity': '8-10 hours'
      },
      rating: 4.7,
      reviews: 234,
      inStock: true,
      isFeatured: false
    },
    {
      id: 603,
      name: 'Professional Makeup Palette',
      description: 'Versatile makeup palette with matte and shimmer finishes for creating day and night looks',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&h=500&fit=crop',
      category: 'Beauty',
      categoryId: 6,
      stock: 40,
      features: ['12 Colors', 'Matte & Shimmer', 'Long-lasting', 'Cruelty-Free', 'Mirror Included'],
      specifications: { 
        'Colors': '12 (6 matte, 6 shimmer)', 
        'Finish': 'Matte & Shimmer', 
        'Weight': '15g total',
        'Cruelty-Free': 'Yes',
        'Vegan': 'Yes'
      },
      rating: 4.6,
      reviews: 189,
      inStock: true,
      isFeatured: true
    },
    {
      id: 604,
      name: 'Complete Hair Care Kit',
      description: 'Nourishing hair care set designed to provide shiny, healthy-looking hair with natural ingredients',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=500&fit=crop',
      category: 'Beauty',
      categoryId: 6,
      stock: 28,
      features: ['Sulfate-Free', 'Nourishing', 'All Hair Types', 'Natural Ingredients', 'Color Safe'],
      specifications: { 
        'Products': '3 items (Shampoo, Conditioner, Hair Mask)', 
        'Hair Type': 'All Types', 
        'Volume': '250ml each',
        'Sulfate-Free': 'Yes',
        'Paraben-Free': 'Yes'
      },
      rating: 4.4,
      reviews: 156,
      inStock: true,
      isFeatured: false
    },
    {
      id: 605,
      name: 'Anti-Aging Serum',
      description: 'Advanced anti-aging serum with retinol and hyaluronic acid for reducing wrinkles and fine lines',
      price: 69.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1556228579-4a6c9cbe6833?w=500&h=500&fit=crop',
      category: 'Beauty',
      categoryId: 6,
      stock: 32,
      features: ['Anti-Aging', 'Retinol Formula', 'Hyaluronic Acid', 'Dermatologist Tested', 'Fast Absorbing'],
      specifications: { 
        'Size': '30ml', 
        'Key Ingredients': 'Retinol, Hyaluronic Acid', 
        'Skin Type': 'All Types',
        'Results': 'Visible in 4 weeks'
      },
      rating: 4.6,
      reviews: 201,
      inStock: true,
      isFeatured: false
    },

    // ========== TOYS & GAMES ==========
    {
      id: 701,
      name: 'Creative Building Blocks Set',
      description: 'Educational building blocks set for children to develop imagination, creativity, and motor skills',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&h=500&fit=crop',
      category: 'Toys & Games',
      categoryId: 7,
      stock: 50,
      features: ['500 Pieces', 'Multiple Colors', 'Educational', 'Age Appropriate', 'Storage Bag'],
      specifications: { 
        'Pieces': '500', 
        'Age': '4+ years', 
        'Material': 'ABS Plastic',
        'Safety': 'Non-toxic, BPA Free',
        'Storage': 'Carrying Bag Included'
      },
      rating: 4.8,
      reviews: 312,
      inStock: true,
      isFeatured: true
    },
    {
      id: 702,
      name: 'Family Board Game Collection',
      description: 'Entertaining board game collection with multiple games suitable for family game nights and parties',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0019?w=500&h=500&fit=crop',
      category: 'Toys & Games',
      categoryId: 7,
      stock: 25,
      features: ['4 Games', 'Family Fun', 'Ages 6+', 'Easy to Learn', '2-6 Players'],
      specifications: { 
        'Games': '4 different board games', 
        'Players': '2-6 per game', 
        'Age': '6+ years',
        'Play Time': '30-60 minutes per game'
      },
      rating: 4.7,
      reviews: 178,
      inStock: true,
      isFeatured: false
    },
    {
      id: 703,
      name: 'Deluxe Doll House',
      description: 'Beautifully detailed doll house with furniture, accessories, and lighting for imaginative play',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=500&h=500&fit=crop',
      category: 'Toys & Games',
      categoryId: 7,
      stock: 12,
      features: ['3 Floors', 'Furniture Included', 'Lights & Sounds', 'Age Appropriate', 'Realistic Details'],
      specifications: { 
        'Floors': '3', 
        'Furniture': '20 pieces included', 
        'Age': '3+ years',
        'Power': 'Battery operated (not included)',
        'Dimensions': '24" x 18" x 36"'
      },
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isFeatured: true
    },
    {
      id: 704,
      name: 'RC Racing Car',
      description: 'Fast remote control racing car with realistic features, LED lights, and easy controls',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&h=500&fit=crop',
      category: 'Toys & Games',
      categoryId: 7,
      stock: 35,
      features: ['Remote Control', 'Fast Speed', 'Rechargeable', 'LED Lights', 'Off-Road Capable'],
      specifications: { 
        'Control': '2.4GHz Wireless', 
        'Battery': 'Rechargeable Li-ion', 
        'Age': '8+ years',
        'Charging Time': '2 hours',
        'Play Time': '30 minutes'
      },
      rating: 4.5,
      reviews: 201,
      inStock: true,
      isFeatured: false
    },
    {
      id: 705,
      name: 'Educational Science Kit',
      description: 'Interactive science experiment kit for children to learn about chemistry and physics through fun experiments',
      price: 34.99,
      originalPrice: 44.99,
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop',
      category: 'Toys & Games',
      categoryId: 7,
      stock: 28,
      features: ['25 Experiments', 'Educational', 'Safe Materials', 'Instruction Manual', 'Ages 8+'],
      specifications: { 
        'Experiments': '25 different activities', 
        'Age': '8+ years', 
        'Materials': 'Non-toxic, safe',
        'Learning Areas': 'Chemistry, Physics'
      },
      rating: 4.6,
      reviews: 145,
      inStock: true,
      isFeatured: false
    },

    // ========== HEALTH & WELLNESS ==========
    {
      id: 801,
      name: 'Whey Protein Powder',
      description: 'Premium whey protein powder for muscle recovery, strength building, and fitness goals',
      price: 44.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&h=500&fit=crop',
      category: 'Health & Wellness',
      categoryId: 8,
      stock: 40,
      features: ['Whey Protein Isolate', 'Muscle Recovery', 'Easy Mixing', 'Great Taste', 'Low Sugar'],
      specifications: { 
        'Size': '2kg (70 servings)', 
        'Flavor': 'Chocolate', 
        'Protein': '24g per serving',
        'Sugar': '1g per serving',
        'Type': 'Whey Isolate'
      },
      rating: 4.6,
      reviews: 267,
      inStock: true,
      isFeatured: true
    },
    {
      id: 802,
      name: 'Advanced Fitness Tracker',
      description: 'Smart fitness tracker with comprehensive health monitoring including heart rate, sleep, and activity tracking',
      price: 99.99,
      originalPrice: 129.99,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&h=500&fit=crop',
      category: 'Health & Wellness',
      categoryId: 8,
      stock: 30,
      features: ['Heart Rate Monitor', 'Activity Tracking', 'Sleep Analysis', 'Water Resistant', 'Smart Notifications'],
      specifications: { 
        'Battery': '7 days', 
        'Waterproof': '50m', 
        'Display': '1.3" Color Touchscreen',
        'Sensors': 'Heart Rate, SpO2, GPS',
        'Compatibility': 'iOS & Android'
      },
      rating: 4.5,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 803,
      name: 'Professional Massage Gun',
      description: 'Deep tissue massage gun with multiple attachments for muscle recovery and pain relief',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1600334089641-3edf13b2b9e9?w=500&h=500&fit=crop',
      category: 'Health & Wellness',
      categoryId: 8,
      stock: 18,
      features: ['Deep Tissue', 'Multiple Attachments', 'Portable', 'Rechargeable', 'Quiet Operation'],
      specifications: { 
        'Attachments': '6 different heads', 
        'Battery': '3 hours continuous use', 
        'Speed': '5 intensity levels',
        'Noise Level': '45 dB',
        'Weight': '1.2kg'
      },
      rating: 4.7,
      reviews: 145,
      inStock: true,
      isFeatured: true
    },
    {
      id: 804,
      name: 'Aromatherapy Essential Oils Set',
      description: 'Premium therapeutic-grade essential oils set for relaxation, meditation, and natural wellness',
      price: 34.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1603661682322-9ed243c53314?w=500&h=500&fit=crop',
      category: 'Health & Wellness',
      categoryId: 8,
      stock: 55,
      features: ['100% Pure', 'Therapeutic Grade', 'Multiple Scents', 'Natural', 'Diffuser Compatible'],
      specifications: { 
        'Oils': '6 different scents', 
        'Size': '10ml each', 
        'Type': 'Therapeutic Grade',
        'Extraction': 'Steam Distillation'
      },
      rating: 4.8,
      reviews: 223,
      inStock: true,
      isFeatured: false
    },
    {
      id: 805,
      name: 'Digital Blood Pressure Monitor',
      description: 'Accurate digital blood pressure monitor with easy-to-read display and memory function',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop',
      category: 'Health & Wellness',
      categoryId: 8,
      stock: 20,
      features: ['Digital Display', 'Memory Function', 'Irregular Heartbeat Detection', 'Easy to Use', 'Carrying Case'],
      specifications: { 
        'Measurement': 'Blood Pressure & Pulse', 
        'Memory': '2x 99 readings', 
        'Power': 'AC adapter or batteries',
        'Cuff Size': '22-32cm'
      },
      rating: 4.4,
      reviews: 178,
      inStock: true,
      isFeatured: false
    },

    // ========== AUTOMOTIVE ==========
    {
      id: 901,
      name: 'Cordless Car Vacuum Cleaner',
      description: 'Powerful portable car vacuum cleaner with strong suction for thorough interior cleaning',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&h=500&fit=crop',
      category: 'Automotive',
      categoryId: 9,
      stock: 25,
      features: ['Portable', 'Powerful Suction', 'Cordless', 'Multiple Attachments', 'Rechargeable'],
      specifications: { 
        'Power': 'Cordless (Li-ion battery)', 
        'Battery': 'Rechargeable, 30min runtime', 
        'Attachments': '3 (crevice, brush, upholstery)',
        'Dust Capacity': '0.5L',
        'Charging Time': '3 hours'
      },
      rating: 4.4,
      reviews: 178,
      inStock: true,
      isFeatured: false
    },
    {
      id: 902,
      name: 'Universal Car Phone Holder',
      description: 'Secure universal car phone holder with strong grip and 360-degree adjustable viewing angles',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=500&h=500&fit=crop',
      category: 'Automotive',
      categoryId: 9,
      stock: 60,
      features: ['Universal Fit', 'Strong Grip', 'Adjustable', 'Easy Installation', 'Dashboard Mount'],
      specifications: { 
        'Compatibility': 'Universal (4-7" phones)', 
        'Mount': 'Dashboard or CD slot', 
        'Color': 'Black',
        'Material': 'ABS Plastic & Silicone',
        'Rotation': '360 degrees'
      },
      rating: 4.6,
      reviews: 312,
      inStock: true,
      isFeatured: true
    },
    {
      id: 903,
      name: 'Premium Car Wax Kit',
      description: 'Professional car wax kit for showroom-level shine and long-lasting protection',
      price: 39.99,
      originalPrice: 49.99,
      image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=500&h=500&fit=crop',
      category: 'Automotive',
      categoryId: 9,
      stock: 35,
      features: ['Premium Wax', 'UV Protection', 'Easy Application', 'Long-lasting', 'Water Beading'],
      specifications: { 
        'Size': '500ml', 
        'Type': 'Liquid Synthetic Wax', 
        'Coverage': '3-4 mid-size cars',
        'Protection': '6 months',
        'Application': 'By hand or machine'
      },
      rating: 4.5,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 904,
      name: 'Car Jump Starter',
      description: 'Portable car jump starter with built-in power bank and emergency features',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1563720223485-8d84e8a6e9b7?w=500&h=500&fit=crop',
      category: 'Automotive',
      categoryId: 9,
      stock: 15,
      features: ['Portable Power', 'Jump Start', 'Power Bank', 'LED Flashlight', 'Safety Protection'],
      specifications: { 
        'Capacity': '12000mAh', 
        'Peak Current': '600A', 
        'Output': 'USB, 12V DC',
        'Compatibility': 'Gas engines up to 6.0L, Diesel up to 3.0L'
      },
      rating: 4.7,
      reviews: 134,
      inStock: true,
      isFeatured: true
    },

    // ========== FOOD & BEVERAGES ==========
    {
      id: 1001,
      name: 'Gourmet Ethiopian Coffee Beans',
      description: 'Premium single-origin arabica coffee beans from Ethiopia with rich flavor and complex aroma',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=500&fit=crop',
      category: 'Food & Beverages',
      categoryId: 10,
      stock: 40,
      features: ['Single Origin', 'Arabica Beans', 'Ethiopian Yirgacheffe', 'Medium Roast', 'Freshly Roasted'],
      specifications: { 
        'Weight': '1kg', 
        'Roast': 'Medium', 
        'Origin': 'Yirgacheffe, Ethiopia',
        'Flavor Notes': 'Bergamot, Blueberry, Dark Chocolate',
        'Processing': 'Washed'
      },
      rating: 4.7,
      reviews: 267,
      inStock: true,
      isFeatured: true
    },
    {
      id: 1002,
      name: 'Organic Tea Collection',
      description: 'Premium collection of organic teas featuring various flavors and proven health benefits',
      price: 34.99,
      originalPrice: 44.99,
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&h=500&fit=crop',
      category: 'Food & Beverages',
      categoryId: 10,
      stock: 28,
      features: ['Organic Certified', 'Multiple Flavors', 'Health Benefits', 'Premium Quality', 'Antioxidant Rich'],
      specifications: { 
        'Tea Bags': '50 bags (10 of each flavor)', 
        'Flavors': 'Green, Black, Herbal, Chamomile, Peppermint', 
        'Type': 'Organic',
        'Certification': 'USDA Organic'
      },
      rating: 4.8,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 1003,
      name: 'Artisan Chocolate Gift Box',
      description: 'Luxury artisan chocolate gift box featuring assorted flavors and elegant packaging',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=500&h=500&fit=crop',
      category: 'Food & Beverages',
      categoryId: 10,
      stock: 22,
      features: ['Artisan Made', 'Assorted Chocolates', 'Premium Quality', 'Gift Box', 'Various Flavors'],
      specifications: { 
        'Pieces': '24 artisan chocolates', 
        'Weight': '500g', 
        'Type': 'Assorted Dark, Milk, White',
        'Cocoa Content': '55-85%',
        'Allergens': 'Contains milk, soy, nuts'
      },
      rating: 4.9,
      reviews: 156,
      inStock: true,
      isFeatured: true
    },
    {
      id: 1004,
      name: 'Extra Virgin Olive Oil',
      description: 'Premium extra virgin olive oil from first cold pressing, perfect for cooking and dressings',
      price: 24.99,
      originalPrice: 34.99,
      image: 'https://images.unsplash.com/photo-1531386450457-57cbc8bedbef?w=500&h=500&fit=crop',
      category: 'Food & Beverages',
      categoryId: 10,
      stock: 35,
      features: ['Extra Virgin', 'First Cold Press', 'Italian Origin', 'Rich Flavor', 'Antioxidant Rich'],
      specifications: { 
        'Size': '500ml', 
        'Type': 'Extra Virgin Olive Oil', 
        'Origin': 'Tuscany, Italy',
        'Acidity': '<0.3%',
        'Extraction': 'First Cold Press'
      },
      rating: 4.6,
      reviews: 201,
      inStock: true,
      isFeatured: false
    },

    // ========== JEWELRY ==========
    {
      id: 1101,
      name: 'Diamond Solitaire Necklace',
      description: 'Exquisite diamond solitaire necklace featuring brilliant cut diamond in elegant 18K gold setting',
      price: 599.99,
      originalPrice: 799.99,
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop',
      category: 'Jewelry',
      categoryId: 11,
      stock: 8,
      features: ['Real Diamonds', '18K White Gold', 'Elegant Design', 'Premium Box', 'Certified'],
      specifications: { 
        'Material': '18K White Gold', 
        'Stones': '0.5ct Diamond', 
        'Length': '18" chain',
        'Clasp': 'Spring Ring',
        'Certification': 'GIA Certified'
      },
      rating: 4.9,
      reviews: 89,
      inStock: true,
      isFeatured: true
    },
    {
      id: 1102,
      name: 'Sterling Silver Bracelet',
      description: 'Beautiful sterling silver bracelet with elegant design and comfortable adjustable fit',
      price: 149.99,
      originalPrice: 199.99,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop',
      category: 'Jewelry',
      categoryId: 11,
      stock: 25,
      features: ['Sterling Silver', 'Adjustable', 'Elegant Design', 'Gift Ready', 'Tarnish Resistant'],
      specifications: { 
        'Material': '925 Sterling Silver', 
        'Type': 'Adjustable Bracelet', 
        'Weight': '25g',
        'Length': 'Adjustable 7-8"',
        'Finish': 'Polished'
      },
      rating: 4.7,
      reviews: 178,
      inStock: true,
      isFeatured: false
    },
    {
      id: 1103,
      name: 'Pearl Earrings Set',
      description: 'Classic pearl earrings set featuring freshwater pearls in elegant sterling silver settings',
      price: 89.99,
      originalPrice: 119.99,
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop',
      category: 'Jewelry',
      categoryId: 11,
      stock: 18,
      features: ['Freshwater Pearls', 'Sterling Silver', 'Classic Design', 'Gift Box', 'Hypoallergenic'],
      specifications: { 
        'Material': '925 Sterling Silver', 
        'Pearls': 'Freshwater, 8mm', 
        'Backing': 'Push Back',
        'Weight': '8g per earring'
      },
      rating: 4.8,
      reviews: 134,
      inStock: true,
      isFeatured: true
    },

    // ========== PET SUPPLIES ==========
    {
      id: 1201,
      name: 'Premium Dry Dog Food',
      description: 'Nutritionally balanced premium dry dog food with natural ingredients for optimal health',
      price: 44.99,
      originalPrice: 59.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
      category: 'Pet Supplies',
      categoryId: 12,
      stock: 50,
      features: ['Nutritionally Balanced', 'Natural Ingredients', 'All Life Stages', 'Vet Recommended', 'Grain Free'],
      specifications: { 
        'Weight': '10kg', 
        'Type': 'Dry Food', 
        'Life Stage': 'All Life Stages',
        'Primary Protein': 'Salmon',
        'Special Features': 'Grain Free, Omega-3'
      },
      rating: 4.6,
      reviews: 312,
      inStock: true,
      isFeatured: true
    },
    {
      id: 1202,
      name: 'Orthopedic Pet Bed',
      description: 'Comfortable orthopedic pet bed with memory foam and washable cover for joint support',
      price: 69.99,
      originalPrice: 89.99,
      image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&h=500&fit=crop',
      category: 'Pet Supplies',
      categoryId: 12,
      stock: 20,
      features: ['Orthopedic Memory Foam', 'Washable Cover', 'Comfortable', 'Multiple Sizes', 'Non-Slip Bottom'],
      specifications: { 
        'Size': 'Large (36" x 28")', 
        'Material': 'Memory Foam + Polyester Cover', 
        'Cover': 'Machine Washable',
        'Weight Capacity': '50kg',
        'Colors': '3 options available'
      },
      rating: 4.8,
      reviews: 189,
      inStock: true,
      isFeatured: false
    },
    {
      id: 1203,
      name: 'Interactive Pet Toys Set',
      description: 'Engaging interactive pet toys set for mental stimulation and physical activity',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://images.unsplash.com/photo-1558322450-86c8c4d9e5eb?w=500&h=500&fit=crop',
      category: 'Pet Supplies',
      categoryId: 12,
      stock: 45,
      features: ['Interactive', 'Durable', 'Multiple Toys', 'Safe Materials', 'Mental Stimulation'],
      specifications: { 
        'Toys': '5 different interactive toys', 
        'Material': 'Non-toxic Rubber & Rope', 
        'Age': 'All ages',
        'Safety': 'Non-toxic, BPA Free'
      },
      rating: 4.5,
      reviews: 234,
      inStock: true,
      isFeatured: false
    },
    {
      id: 1204,
      name: 'Professional Pet Grooming Kit',
      description: 'Complete pet grooming kit with all essential tools for professional-level pet care at home',
      price: 49.99,
      originalPrice: 69.99,
      image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&h=500&fit=crop',
      category: 'Pet Supplies',
      categoryId: 12,
      stock: 30,
      features: ['Complete Set', 'Professional Quality', 'Easy to Use', 'Durable', 'Safe for Pets'],
      specifications: { 
        'Tools': '8 pieces (clippers, brushes, nail trimmer, etc.)', 
        'Material': 'Stainless Steel & ABS Plastic', 
        'Pets': 'Dogs & Cats',
        'Power': 'Corded electric clippers'
      },
      rating: 4.7,
      reviews: 167,
      inStock: true,
      isFeatured: true
    },
    {
      id: 1205,
      name: 'Automatic Pet Feeder',
      description: 'Smart automatic pet feeder with programmable scheduling and portion control',
      price: 79.99,
      originalPrice: 99.99,
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop',
      category: 'Pet Supplies',
      categoryId: 12,
      stock: 15,
      features: ['Programmable', 'Portion Control', 'LCD Display', 'Battery Backup', 'Voice Recording'],
      specifications: { 
        'Capacity': '4L dry food', 
        'Meals': 'Up to 4 meals per day', 
        'Power': 'AC adapter with battery backup',
        'Portion Size': '1/8 to 2 cups per meal'
      },
      rating: 4.6,
      reviews: 145,
      inStock: true,
      isFeatured: false
    }
  ];

  
getProductById(id: number): Product | undefined {
 
  return this.products.find(product => product.id === id);
}


  getProductsByCategory(categoryId: number) {
    return this.products.filter(product => product.categoryId === categoryId);
  }

  getFeaturedProducts() {
    return this.products.filter(product => product.isFeatured);
  }

  getRelatedProducts(productId: number, limit: number = 4) {
    const product = this.getProductById(productId);
    if (!product) return [];
    
    return this.products
      .filter(p => p.categoryId === product.categoryId && p.id !== productId)
      .slice(0, limit);
  }

  searchProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery)
    );
  }
}