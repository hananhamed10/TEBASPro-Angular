

// ==================== الأساسيات ====================

// المنتج
export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image: string;
  categoryId: number; // ⬅️ اجعله required ليس optional
  stock?: number;
  originalPrice?: number;
  color?: string;
  size?: string;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  discount?: number;
  isFeatured?: boolean;
  reviews?: number;
}

// الفئة
export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}

// المستخدم
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  isAdmin?: boolean;
  avatar?: string;
}

// ==================== المتجر ====================

// عنصر العربة
export interface CartItem {
  product: Product;
  quantity: number;
  addedAt?: Date;
}

// عنصر المفضلة
export interface WishlistItem {
  productId: number;
  product?: Product;
}

//عنصر الطلب
// في model.ts - عدل تعريف OrderItem و Order
// export interface OrderItem {
//   id: string;
//   productId: string; // ✅ إضافة هذا السطر
//   product: {
//     id: string;
//     name: string;
//     price: number;
//     image: string;
//     categoryId?: number; // ✅ إضافة هذا الاختياري
//   };
//   quantity: number;
//   price: number;
//   subtotal?: number; // ✅ إضافة هذا الاختياري
// }


export interface Order {
  id: string;
  orderNumber: string;
  date: string; // ⬅️ استخدم date بدلاً من createdAt
  createdAt?: string; // ⬅️ أضف كـ optional للتوافق
  updatedAt?: string; // ⬅️ أضف كـ optional
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  
  // Shipping Information
  shippingAddress?: ShippingAddress;
  
  // Payment Information
  paymentMethod?: string;
  paymentStatus?: string;
  payment?: PaymentInfo;
  
  // Customer Information
  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  
  // Additional Fields
  notes?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  cancelledDate?: string;
  deliveredDate?: string;
  
  // Delivery Information
  delivery?: {
    estimatedDate?: string;
    deliveredAt?: string;
    carrier?: string;
    trackingNumber?: string;
  };
}



export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  subtotal: number;
  color?: string; // ⬅️ أضف
  size?: string;  // ⬅️ أضف
}

// تحديث ShippingAddress
export interface ShippingAddress {
  name: string;
  fullName?: string; // ⬅️ أضف للتوافق
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
}

// تحديث PaymentInfo
export interface PaymentInfo {
  method: string;
  status: 'pending' | 'paid' | 'failed';
  transactionId?: string;
  paymentDate?: string;
  paidAt?: string; // ⬅️ أضف للتوافق
}


// ==================== المراجعات ====================

// التقييم
export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}

// ==================== المصادقة ====================

// طلب تسجيل الدخول
export interface LoginRequest {
  email: string;
  password: string;
}

// طلب التسجيل
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// استجابة المصادقة
export interface AuthResponse {
  user: User;
  token: string;
}

// ==================== API ====================

// استجابة API عامة
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// ==================== الفلاتر ====================

// فلتر المنتجات
export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'newest';
}