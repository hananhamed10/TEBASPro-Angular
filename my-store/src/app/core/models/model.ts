

export interface Product {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  image: string;
  categoryId: number; 
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


export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  productCount?: number;
}


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


export interface CartItem {
  product: Product;
  quantity: number;
  addedAt?: Date;
}


export interface WishlistItem {
  productId: number;
  product?: Product;
}



export interface Order {
  id: string;
  orderNumber: string;
  date: string; 
  createdAt?: string; 
  updatedAt?: string; 
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount?: number;
  total: number;
  

  shippingAddress?: ShippingAddress;
  

  paymentMethod?: string;
  paymentStatus?: string;
  payment?: PaymentInfo;
  

  customerId?: number;
  customerName?: string;
  customerEmail?: string;
  

  notes?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  carrier?: string;
  cancelledDate?: string;
  deliveredDate?: string;
  
 
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
  color?: string; 
  size?: string;  
}


export interface ShippingAddress {
  name: string;
  fullName?: string; 
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
  paidAt?: string; 
}




export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}


export interface AuthResponse {
  user: User;
  token: string;
}


export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}


export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy?: 'price' | 'name' | 'newest';
}