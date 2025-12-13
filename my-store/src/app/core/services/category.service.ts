// src/app/core/services/category.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  categories = [
    {
      id: 1,
      name: 'Electronics',
      description: 'Smartphones, laptops, tablets and accessories',
      productCount: 45,
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop',
      products: [
        {
          id: 101, name: 'iphone 15 pro', price: 999.99,
          image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop',
          description: 'latest smartphone with advanced features'
        },
        {
          id: 102, name: 'macbook air', price: 1299.99,
          image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=200&fit=crop',
          description: 'powerful laptop for work and creativity'
        },
        {
          id: 103, name: 'wireless headphones', price: 199.99,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
          description: 'premium sound quality with noise cancellation'
        },
        {
          id: 104, name: 'smart watch', price: 299.99,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
          description: 'fitness tracking and smart notifications'
        },
        {
          id: 105, name: 'tablet', price: 499.99,
          image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&h=200&fit=crop',
          description: 'perfect for entertainment and productivity'
        },
        {
          id: 106, name: 'gaming console', price: 399.99,
          image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=300&h=200&fit=crop',
          description: 'next-gen gaming experience'
        }
      ]
    },
    {
      id: 2,
      name: 'Fashion',
      description: 'Clothing, shoes, and accessories for all styles',
      productCount: 78,
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop',
      products: [
        {
          id: 201, name: 'designer dress', price: 89.99,
          image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=200&fit=crop',
          description: 'elegant dress for special occasions'
        },
        {
          id: 202, name: 'sneakers', price: 129.99,
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop',
          description: 'comfortable and stylish sneakers'
        },
        {
          id: 203, name: 'leather jacket', price: 199.99,
          image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=200&fit=crop',
          description: 'premium leather jacket for all seasons'
        },
        {
          id: 204, name: 'handbag', price: 149.99,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=200&fit=crop',
          description: 'luxury handbag for everyday use'
        },
        {
          id: 205, name: 'sunglasses', price: 79.99,
          image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=200&fit=crop',
          description: 'designer sunglasses with UV protection'
        },
        {
          id: 206, name: 'watch', price: 249.99,
          image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=200&fit=crop',
          description: 'elegant wristwatch for formal occasions'
        },
        {
          id: 207, name: 'jewelry set', price: 179.99,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
          description: 'beautiful necklace and earrings set'
        }
      ]
    },
    {
      id: 3,
      name: 'Home & Garden',
      description: 'Furniture, decor, and gardening supplies',
      productCount: 32,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
      products: [
        {
          id: 301, name: 'sofa set', price: 899.99,
          image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop',
          description: 'comfortable 3-piece sofa set for living room'
        },
        {
          id: 302, name: 'garden tools', price: 49.99,
          image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300&h=200&fit=crop',
          description: 'complete gardening tool kit'
        },
        {
          id: 303, name: 'wall art', price: 79.99,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          description: 'beautiful wall art for home decoration'
        },
        {
          id: 304, name: 'bed set', price: 299.99,
          image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=300&h=200&fit=crop',
          description: 'luxury bed set with premium materials'
        },
        {
          id: 305, name: 'kitchenware', price: 129.99,
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
          description: 'complete kitchen utensil set'
        },
        {
          id: 306, name: 'plants', price: 39.99,
          image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=200&fit=crop',
          description: 'beautiful indoor plants for home'
        }
      ]
    },
    {
      id: 4,
      name: 'Sports',
      description: 'Sports equipment and outdoor adventure gear',
      productCount: 23,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
      products: [
        {
          id: 401, name: 'yoga mat', price: 29.99,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
          description: 'non-slip yoga mat for exercise'
        },
        {
          id: 402, name: 'running shoes', price: 119.99,
          image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop',
          description: 'professional running shoes'
        },
        {
          id: 403, name: 'dumbbell set', price: 89.99,
          image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
          description: 'adjustable dumbbell set for home gym'
        },
        {
          id: 404, name: 'bicycle', price: 299.99,
          image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=300&h=200&fit=crop',
          description: 'mountain bike for outdoor adventures'
        },
        {
          id: 405, name: 'camping tent', price: 149.99,
          image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=300&h=200&fit=crop',
          description: 'waterproof tent for 4 people'
        }
      ]
    },
    {
      id: 5,
      name: 'Books',
      description: 'Fiction, non-fiction, and educational books',
      productCount: 156,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=200&fit=crop',
      products: [
        {
          id: 501, name: 'novel collection', price: 24.99,
          image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop',
          description: 'bestselling novel series'
        },
        {
          id: 502, name: 'cookbook', price: 19.99,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
          description: 'delicious recipes from around the world'
        },
        {
          id: 503, name: 'science encyclopedia', price: 39.99,
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
          description: 'comprehensive science reference book'
        },
        {
          id: 504, name: 'children books', price: 14.99,
          image: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=200&fit=crop',
          description: 'educational books for children'
        },
        {
          id: 505, name: 'business books', price: 29.99,
          image: 'https://images.unsplash.com/photo-1531346684869-cd7b60f66a59?w=300&h=200&fit=crop',
          description: 'guides for entrepreneurs and managers'
        },
        {
          id: 506, name: 'art books', price: 34.99,
          image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop',
          description: 'beautiful art collections and tutorials'
        },
        {
          id: 507, name: 'history books', price: 27.99,
          image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=200&fit=crop',
          description: 'historical events and biographies'
        },
        {
          id: 508, name: 'language learning', price: 22.99,
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
          description: 'books for learning new languages'
        }
      ]
    },
    {
      id: 6,
      name: 'Beauty',
      description: 'Skincare, makeup, and personal care products',
      productCount: 67,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop',
      products: [
        {
          id: 601, name: 'skincare set', price: 59.99,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop',
          description: 'complete daily skincare routine'
        },
        {
          id: 602, name: 'perfume', price: 79.99,
          image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&h=200&fit=crop',
          description: 'luxury fragrance for men and women'
        },
        {
          id: 603, name: 'makeup kit', price: 49.99,
          image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=200&fit=crop',
          description: 'professional makeup collection'
        },
        {
          id: 604, name: 'hair care', price: 34.99,
          image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300&h=200&fit=crop',
          description: 'shampoo and conditioner set'
        },
        {
          id: 605, name: 'face masks', price: 19.99,
          image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop',
          description: 'rejuvenating facial masks'
        }
      ]
    },
    {
      id: 7,
      name: 'Toys & Games',
      description: 'Fun toys and games for all ages',
      productCount: 89,
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=200&fit=crop',
      products: [
        {
          id: 701, name: 'lego set', price: 49.99,
          image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=300&h=200&fit=crop',
          description: 'creative building blocks for kids'
        },
        {
          id: 702, name: 'board games', price: 29.99,
          image: 'https://images.unsplash.com/photo-1632501641765-e568d28b0019?w=300&h=200&fit=crop',
          description: 'family board games for all ages'
        },
        {
          id: 703, name: 'doll house', price: 79.99,
          image: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?w=300&h=200&fit=crop',
          description: 'beautiful doll house with furniture'
        },
        {
          id: 704, name: 'remote car', price: 39.99,
          image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=300&h=200&fit=crop',
          description: 'remote control car with lights'
        },
        {
          id: 705, name: 'puzzle', price: 24.99,
          image: 'https://images.unsplash.com/photo-1616628188522-1d5d8cdee6c9?w=300&h=200&fit=crop',
          description: '1000 piece challenging puzzle'
        },
        {
          id: 706, name: 'educational toys', price: 34.99,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          description: 'learning toys for children development'
        }
      ]
    },
    {
      id: 8,
      name: 'Health & Wellness',
      description: 'Vitamins, supplements, and fitness equipment',
      productCount: 54,
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=200&fit=crop',
      products: [
        {
          id: 801, name: 'protein powder', price: 44.99,
          image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=300&h=200&fit=crop',
          description: 'whey protein for muscle recovery'
        },
        {
          id: 802, name: 'vitamins', price: 29.99,
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=200&fit=crop',
          description: 'multivitamin supplements for health'
        },
        {
          id: 803, name: 'fitness tracker', price: 89.99,
          image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=200&fit=crop',
          description: 'track your steps and heart rate'
        },
        {
          id: 804, name: 'massage gun', price: 129.99,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
          description: 'deep tissue massage for recovery'
        },
        {
          id: 805, name: 'essential oils', price: 19.99,
          image: 'https://images.unsplash.com/photo-1603661682322-9ed243c53314?w=300&h=200&fit=crop',
          description: 'aromatherapy oils for relaxation'
        }
      ]
    },
    {
      id: 9,
      name: 'Automotive',
      description: 'Car accessories and maintenance products',
      productCount: 41,
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=200&fit=crop',
      products: [
        {
          id: 901, name: 'car vacuum', price: 59.99,
          image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
          description: 'powerful vacuum for car cleaning'
        },
        {
          id: 902, name: 'phone holder', price: 24.99,
          image: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=300&h=200&fit=crop',
          description: 'dashboard phone mount for navigation'
        },
        {
          id: 903, name: 'car wax', price: 34.99,
          image: 'https://images.unsplash.com/photo-1507136566006-cfc505b114fc?w=300&h=200&fit=crop',
          description: 'premium car wax for shine and protection'
        },
        {
          id: 904, name: 'emergency kit', price: 49.99,
          image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=300&h=200&fit=crop',
          description: 'car emergency tools and first aid'
        }
      ]
    },
    {
      id: 10,
      name: 'Food & Beverages',
      description: 'Gourmet foods and specialty drinks',
      productCount: 112,
      image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
      products: [
        {
          id: 1001, name: 'gourmet coffee', price: 24.99,
          image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
          description: 'premium coffee beans from around the world'
        },
        {
          id: 1002, name: 'organic tea', price: 19.99,
          image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=200&fit=crop',
          description: 'herbal and organic tea collection'
        },
        {
          id: 1003, name: 'chocolate box', price: 34.99,
          image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&h=200&fit=crop',
          description: 'luxury assorted chocolates'
        },
        {
          id: 1004, name: 'olive oil', price: 29.99,
          image: 'https://images.unsplash.com/photo-1536975700520-1a392e2f523e?w=300&h=200&fit=crop',
          description: 'extra virgin olive oil from Italy'
        },
        {
          id: 1005, name: 'spice set', price: 39.99,
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&h=200&fit=crop',
          description: 'exotic spices from different cuisines'
        },
        {
          id: 1006, name: 'wine collection', price: 89.99,
          image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=300&h=200&fit=crop',
          description: 'premium wines from famous vineyards'
        }
      ]
    },
    {
      id: 11,
      name: 'Jewelry',
      description: 'Elegant jewelry and accessories',
      productCount: 38,
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
      products: [
        {
          id: 1101, name: 'diamond ring', price: 599.99,
          image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=300&h=200&fit=crop',
          description: 'beautiful diamond engagement ring'
        },
        {
          id: 1102, name: 'gold necklace', price: 299.99,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&h=200&fit=crop',
          description: 'elegant gold chain necklace'
        },
        {
          id: 1103, name: 'silver bracelet', price: 149.99,
          image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop',
          description: 'sterling silver bracelet with charm'
        },
        {
          id: 1104, name: 'pearl earrings', price: 199.99,
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&h=200&fit=crop',
          description: 'classic pearl stud earrings'
        },
        {
          id: 1105, name: 'watch', price: 349.99,
          image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&h=200&fit=crop',
          description: 'luxury wristwatch with leather strap'
        }
      ]
    },
    {
      id: 12,
      name: 'Pet Supplies',
      description: 'Everything for your furry friends',
      productCount: 76,
      image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=200&fit=crop',
      products: [
        {
          id: 1201, name: 'pet food', price: 44.99,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
          description: 'premium nutrition for dogs and cats'
        },
        {
          id: 1202, name: 'pet bed', price: 59.99,
          image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=300&h=200&fit=crop',
          description: 'comfortable orthopedic pet bed'
        },
        {
          id: 1203, name: 'pet toys', price: 19.99,
          image: 'https://images.unsplash.com/photo-1558322450-86c8c4d9e5eb?w=300&h=200&fit=crop',
          description: 'interactive toys for pets'
        },
        {
          id: 1204, name: 'grooming kit', price: 34.99,
          image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=300&h=200&fit=crop',
          description: 'complete pet grooming supplies'
        },
        {
          id: 1205, name: 'pet carrier', price: 79.99,
          image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=200&fit=crop',
          description: 'travel carrier for small pets'
        },
        {
          id: 1206, name: 'feeding bowl', price: 24.99,
          image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop',
          description: 'stainless steel pet feeding bowls'
        }
      ]
    }
  ];

  // تجيب كل الكاتيجوريز
  getCategories() {
    return this.categories;
  }

  // تجيب كاتيجوري بالـ ID
  getCategoryById(id: number) {
    return this.categories.find(category => category.id === id);
  }

  // تجيب كل البرودكتس من كل الكاتيجوريز
  getAllProducts() {
    return this.categories.flatMap(category => 
      category.products.map(product => ({
        ...product,
        categoryName: category.name,
        categoryId: category.id
      }))
    );
  }

  // تجيب برودكتس كاتيجوري معينة
  getProductsByCategory(categoryId: number) {
    const category = this.getCategoryById(categoryId);
    return category ? category.products : [];
  }
}