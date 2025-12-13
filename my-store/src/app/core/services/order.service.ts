import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { Product, Order, OrderItem, ShippingAddress } from '../../core/models/model';

// export interface PaymentInfo {
//   method: string;
//   status: 'pending' | 'paid' | 'failed';
//   transactionId: string;
//   paymentDate: string;
// }

export interface OrderResponse {
  success: boolean;
  message?: string;
  order?: Order;
  orders?: Order[];
}

export interface TrackingEvent {
  status: string;
  date: string;
  location?: string;
  description?: string;
}

export interface TrackingInfo {
  orderId: string;
  orderNumber: string;
  status: string;
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: string;
  events: TrackingEvent[];
  service?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private storageKey = 'user_orders';

  constructor(private cartService: CartService) {}

  // ✅ 1. إضافة downloadInvoice المطلوبة
  downloadInvoice(orderId: string): Observable<Blob> {
    return new Observable<Blob>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
          observer.error(new Error('Order not found'));
          observer.complete();
          return;
        }

        // إنشاء محتوى الفاتورة (PDF simulation)
        const invoiceContent = this.generateInvoiceContent(order);
        const blob = new Blob([invoiceContent], { type: 'application/pdf' });
        
        setTimeout(() => {
          observer.next(blob);
          observer.complete();
        }, 300);
        
      } catch (error: any) {
        console.error('Error generating invoice:', error);
        observer.error(error);
        observer.complete();
      }
    });
  }

  private generateInvoiceContent(order: Order): string {
    // حساب الخصم إذا كان موجوداً
    const discount = order.discount || 0;
    
    const invoiceData = `
INVOICE
=======================
Order Number: ${order.orderNumber}
Date: ${new Date(order.date).toLocaleDateString()}

BILL TO:
${order.customerName || 'Customer'}
${order.shippingAddress?.street || 'Not specified'}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} 
${order.shippingAddress?.zipCode || ''}
${order.shippingAddress?.country || ''}
Phone: ${order.shippingAddress?.phone || 'N/A'}
Email: ${order.customerEmail || 'N/A'}

ITEMS:
${order.items.map(item => `
  ${item.product.name} x${item.quantity}
  Price: $${item.price.toFixed(2)} each
  Subtotal: $${item.subtotal.toFixed(2)}
`).join('')}

SUMMARY:
=======================
Subtotal: $${order.subtotal.toFixed(2)}
Shipping: $${order.shipping.toFixed(2)}
Tax: $${order.tax.toFixed(2)}
${discount > 0 ? `Discount: -$${discount.toFixed(2)}` : ''}
-----------------------
TOTAL: $${order.total.toFixed(2)}

Payment Method: ${order.payment?.method || order.paymentMethod || 'N/A'}
Payment Status: ${order.payment?.status || order.paymentStatus || 'N/A'}
${order.payment?.transactionId ? `Transaction ID: ${order.payment.transactionId}` : ''}

Thank you for your purchase!
    `;
    
    return invoiceData;
  }

  // ✅ 2. تحسين trackOrder مع الـ interface الجديد
  trackOrder(orderId: string): Observable<TrackingInfo> {
    return new Observable<TrackingInfo>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
          observer.error(new Error('Order not found'));
          observer.complete();
          return;
        }
        
        const trackingInfo: TrackingInfo = {
          orderId: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          carrier: order.carrier || 'UPS',
          trackingNumber: order.trackingNumber || this.generateTrackingNumber(),
          estimatedDelivery: order.estimatedDelivery || this.calculateEstimatedDelivery(),
          events: this.generateTrackingEvents(order.status, order.date),
          service: 'Standard Shipping'
        };
        
        setTimeout(() => {
          observer.next(trackingInfo);
          observer.complete();
        }, 300);
        
      } catch (error: any) {
        console.error('Error tracking order:', error);
        observer.error(error);
        observer.complete();
      }
    });
  }

  getUserOrders(): Observable<Order[]> {
    return new Observable<Order[]>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        setTimeout(() => {
          observer.next(orders);
          observer.complete();
        }, 300);
      } catch (error: any) {
        console.error('Error loading orders:', error);
        setTimeout(() => {
          observer.next([]);
          observer.complete();
        }, 300);
      }
    });
  }

  getOrderDetails(orderId: string): Observable<Order | null> {
    return new Observable<Order | null>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const order = orders.find(o => o.id === orderId);
        
        setTimeout(() => {
          observer.next(order || null);
          observer.complete();
        }, 200);
      } catch (error: any) {
        console.error('Error loading order details:', error);
        setTimeout(() => {
          observer.next(null);
          observer.complete();
        }, 200);
      }
    });
  }

  getOrderByNumber(orderNumber: string): Observable<Order | null> {
    return new Observable<Order | null>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const order = orders.find(o => o.orderNumber === orderNumber);
        
        setTimeout(() => {
          observer.next(order || null);
          observer.complete();
        }, 200);
      } catch (error: any) {
        console.error('Error loading order by number:', error);
        setTimeout(() => {
          observer.next(null);
          observer.complete();
        }, 200);
      }
    });
  }

  createOrder(orderData: any): Observable<OrderResponse> {
    return new Observable<OrderResponse>(observer => {
      try {
        const cartItems = this.cartService.getCartItems();
        
        if (cartItems.length === 0) {
          observer.next({ 
            success: false, 
            message: 'Your cart is empty. Add products first.' 
          });
          observer.complete();
          return;
        }

        const orders = this.getOrdersFromStorage();
        const orderId = 'ORD-' + Date.now();
        const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
        
        // ✅ إصلاح: إنشاء orderItems مع properties كاملة
        const orderItems: OrderItem[] = cartItems.map((item, index) => {
          const product = item.product;
          const quantity = item.quantity || 1;
          const price = product.price || 0;
          
          // ✅ إصلاح: إنشاء product كامل
          const fullProduct: Product = {
            id: String(product.id),
            name: product.name || 'Product',
            price: price,
            image: product.image || 'assets/images/products/placeholder.jpg',
            categoryId: product.categoryId || 1,
            description: product.description || '',
            stock: product.stock || 0
          };
          
          return {
            id: `ITEM-${Date.now()}-${index}`,
            productId: String(product.id),
            product: fullProduct,
            quantity: quantity,
            price: price,
            subtotal: price * quantity  // ✅ مضمون ليس undefined
          };
        });

        // ✅ إصلاح: حساب القيم
        const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
        const shipping = orderData.shipping || this.calculateShipping(subtotal);
        const tax = this.calculateTax(subtotal);
        const discount = orderData.discount || 0;
        const total = subtotal + shipping + tax - discount;

        const customerInfo = orderData.customerInfo || {};
        const customerId = customerInfo.id || 0;
        const customerName = `${customerInfo.firstName || ''} ${customerInfo.lastName || ''}`.trim() || 'Customer';
        const customerEmail = customerInfo.email || '';
        const customerPhone = customerInfo.phone || '';

        const newOrder: Order = {
          id: orderId,
          orderNumber: orderNumber,
          date: new Date().toISOString(),
          status: 'pending',
          items: orderItems,
          subtotal: subtotal,
          shipping: shipping,
          tax: tax,
          total: total,
          shippingAddress: {
            name: customerName,
            street: customerInfo.address || 'Not specified',
            city: customerInfo.city || 'Cairo',
            state: customerInfo.state || 'Cairo',
            zipCode: customerInfo.zipCode || '11511',
            country: customerInfo.country || 'Egypt',
            phone: customerPhone,
            email: customerEmail
          },
          paymentMethod: this.mapPaymentMethod(orderData.paymentMethod),
          paymentStatus: 'pending',
          payment: {
            method: orderData.paymentMethod || 'Credit Card',
            status: 'pending',
            transactionId: '',
            paymentDate: ''
          },
          customerId: customerId,
          customerName: customerName,
          customerEmail: customerEmail,
          notes: orderData.notes || '',
          estimatedDelivery: this.calculateEstimatedDelivery()
        };
        
        // ✅ إضافة discount فقط إذا كان موجوداً
        if (discount > 0) {
          newOrder.discount = discount;
        }
        
        orders.unshift(newOrder);
        this.saveOrders(orders);
        
        setTimeout(() => {
          observer.next({ 
            success: true, 
            order: newOrder,
            message: 'Order created successfully' 
          });
          observer.complete();
        }, 500);
        
      } catch (error: any) {
        console.error('Error creating order:', error);
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to create order' 
          });
          observer.complete();
        }, 500);
      }
    });
  }

  updateOrderPaymentStatus(orderId: string, paymentStatus: 'pending' | 'paid' | 'failed', transactionId: string = ''): Observable<OrderResponse> {
    return new Observable<OrderResponse>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
          observer.next({ 
            success: false, 
            message: 'Order not found' 
          });
          observer.complete();
          return;
        }
        
        if (orders[orderIndex].payment) {
          orders[orderIndex].payment!.status = paymentStatus;
          orders[orderIndex].payment!.paymentDate = new Date().toISOString();
          orders[orderIndex].payment!.transactionId = transactionId;
        }
        
        orders[orderIndex].paymentStatus = paymentStatus;
        
        if (paymentStatus === 'paid') {
          orders[orderIndex].status = 'processing';
          orders[orderIndex].trackingNumber = this.generateTrackingNumber();
          orders[orderIndex].carrier = 'UPS';
        } else if (paymentStatus === 'failed') {
          orders[orderIndex].status = 'pending';
        }
        
        this.saveOrders(orders);
        
        setTimeout(() => {
          observer.next({ 
            success: true, 
            order: orders[orderIndex],
            message: `Payment status updated to ${paymentStatus}` 
          });
          observer.complete();
        }, 300);
        
      } catch (error: any) {
        console.error('Error updating payment status:', error);
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to update payment status' 
          });
          observer.complete();
        }, 300);
      }
    });
  }

  updateOrderStatus(orderId: string, status: Order['status']): Observable<OrderResponse> {
    return new Observable<OrderResponse>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const orderIndex = orders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
          observer.next({ 
            success: false, 
            message: 'Order not found' 
          });
          observer.complete();
          return;
        }
        
        orders[orderIndex].status = status;
        
        if (status === 'shipped') {
          orders[orderIndex].trackingNumber = orders[orderIndex].trackingNumber || this.generateTrackingNumber();
          orders[orderIndex].estimatedDelivery = this.calculateEstimatedDelivery();
        } else if (status === 'delivered') {
          orders[orderIndex].deliveredDate = new Date().toISOString();
        } else if (status === 'cancelled') {
          orders[orderIndex].cancelledDate = new Date().toISOString();
        }
        
        this.saveOrders(orders);
        
        setTimeout(() => {
          observer.next({ 
            success: true, 
            order: orders[orderIndex],
            message: `Order status updated to ${status}` 
          });
          observer.complete();
        }, 300);
        
      } catch (error: any) {
        console.error('Error updating order status:', error);
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to update order status' 
          });
          observer.complete();
        }, 300);
      }
    });
  }

  cancelOrder(orderId: string): Observable<OrderResponse> {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  reorder(orderId: string): Observable<OrderResponse> {
    return new Observable<OrderResponse>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const order = orders.find(o => o.id === orderId);
        
        if (!order) {
          observer.next({ 
            success: false, 
            message: 'Order not found' 
          });
          observer.complete();
          return;
        }
        
        let addedCount = 0;
        const totalItems = order.items.length;
        
        order.items.forEach(item => {
          const product: Product = {
            id: String(item.product.id),
            name: item.product.name,
            description: item.product.description || '',
            price: item.product.price,
            image: item.product.image || 'assets/images/products/placeholder.jpg',
            categoryId: item.product.categoryId || 1,
            stock: item.product.stock || 0
          };
          
          this.cartService.addToCart(product, item.quantity).subscribe({
            next: (response: any) => {
              addedCount++;
              if (addedCount === totalItems) {
                observer.next({ 
                  success: true, 
                  message: 'All items added to cart successfully'
                });
                observer.complete();
              }
            },
            error: (error: any) => {
              console.error('Error adding item to cart:', error);
              addedCount++;
              if (addedCount === totalItems) {
                observer.next({ 
                  success: false, 
                  message: 'Some items could not be added'
                });
                observer.complete();
              }
            }
          });
        });
        
      } catch (error: any) {
        console.error('Error reordering:', error);
        setTimeout(() => {
          observer.next({ 
            success: false, 
            message: 'Failed to reorder' 
          });
          observer.complete();
        }, 500);
      }
    });
  }

  getRecentOrders(limit: number = 5): Observable<Order[]> {
    return new Observable<Order[]>(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const recentOrders = orders
          .sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
        
        setTimeout(() => {
          observer.next(recentOrders);
          observer.complete();
        }, 200);
      } catch (error: any) {
        console.error('Error loading recent orders:', error);
        setTimeout(() => {
          observer.next([]);
          observer.complete();
        }, 200);
      }
    });
  }

  getOrderStats(): Observable<{
    totalOrders: number;
    totalSpent: number;
    pendingOrders: number;
    deliveredOrders: number;
    averageOrderValue: number;
  }> {
    return new Observable(observer => {
      try {
        const orders = this.getOrdersFromStorage();
        const totalOrders = orders.length;
        const totalSpent = orders.reduce((sum: number, order: Order) => sum + order.total, 0);
        const pendingOrders = orders.filter((o: Order) => o.status === 'pending').length;
        const deliveredOrders = orders.filter((o: Order) => o.status === 'delivered').length;
        const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
        
        setTimeout(() => {
          observer.next({
            totalOrders,
            totalSpent,
            pendingOrders,
            deliveredOrders,
            averageOrderValue
          });
          observer.complete();
        }, 200);
      } catch (error: any) {
        console.error('Error loading order stats:', error);
        setTimeout(() => {
          observer.next({
            totalOrders: 0,
            totalSpent: 0,
            pendingOrders: 0,
            deliveredOrders: 0,
            averageOrderValue: 0
          });
          observer.complete();
        }, 200);
      }
    });
  }

  private mapPaymentMethod(method: string): 'credit_card' | 'paypal' | 'cash' {
    const methodLower = method.toLowerCase();
    
    if (methodLower.includes('credit') || methodLower.includes('card') || methodLower.includes('visa') || methodLower.includes('mastercard')) {
      return 'credit_card';
    } else if (methodLower.includes('paypal')) {
      return 'paypal';
    } else {
      return 'cash';
    }
  }

  private getOrdersFromStorage(): Order[] {
    try {
      const orders = localStorage.getItem(this.storageKey);
      if (orders) {
        const parsedOrders: any[] = JSON.parse(orders);
        return this.convertOrderTypes(parsedOrders);
      }
      
      return this.createSampleOrders();
    } catch (error: any) {
      console.error('Error parsing orders:', error);
      return this.createSampleOrders();
    }
  }

  private convertOrderTypes(orders: any[]): Order[] {
    return orders.map((order: any) => ({
      ...order,
      items: order.items.map((item: any, index: number) => ({
        id: item.id || `ITEM-${Date.now()}-${index}`,
        productId: String(item.productId || item.product?.id || index),
        product: {
          id: String(item.product?.id || item.productId || index),
          name: item.product?.name || 'Product',
          price: Number(item.product?.price) || 0,
          image: item.product?.image || 'assets/images/products/placeholder.jpg',
          categoryId: Number(item.product?.categoryId) || 1,
          description: item.product?.description || '',
          stock: Number(item.product?.stock) || 0
        },
        quantity: Number(item.quantity) || 1,
        price: Number(item.price) || 0,
        subtotal: Number(item.subtotal) || (Number(item.price) || 0) * (Number(item.quantity) || 1)
      })),
      subtotal: Number(order.subtotal) || 0,
      shipping: Number(order.shipping) || 0,
      tax: Number(order.tax) || 0,
      total: Number(order.total) || 0,
      discount: order.discount !== undefined ? Number(order.discount) : undefined,
      customerId: Number(order.customerId) || 0,
      paymentMethod: order.paymentMethod || this.mapPaymentMethod(order.payment?.method),
      paymentStatus: order.paymentStatus || order.payment?.status || 'pending'
    }));
  }

  private saveOrders(orders: Order[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(orders));
    } catch (error: any) {
      console.error('Error saving orders:', error);
    }
  }

  private calculateShipping(subtotal: number): number {
    if (subtotal >= 50) {
      return 0;
    }
    return 9.99;
  }

  private calculateTax(subtotal: number): number {
    return parseFloat((subtotal * 0.14).toFixed(2));
  }

  private calculateEstimatedDelivery(): string {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  }

  private generateTrackingNumber(): string {
    return 'UPS' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }

  private generateTrackingEvents(status: Order['status'], orderDate: string): TrackingEvent[] {
    const events: TrackingEvent[] = [
      { 
        status: 'Order Placed', 
        date: new Date(orderDate).toISOString(), 
        location: 'Online Store',
        description: 'Your order has been placed successfully'
      },
      { 
        status: 'Processing', 
        date: new Date(new Date(orderDate).getTime() + 3600000).toISOString(), 
        location: 'Warehouse',
        description: 'Order is being processed'
      }
    ];
    
    if (status === 'processing' || status === 'shipped' || status === 'delivered') {
      events.push({ 
        status: 'Ready for Shipment', 
        date: new Date(new Date(orderDate).getTime() + 86400000).toISOString(), 
        location: 'Distribution Center',
        description: 'Package is ready for shipment'
      });
    }
    
    if (status === 'shipped' || status === 'delivered') {
      events.push({ 
        status: 'Shipped', 
        date: new Date(new Date(orderDate).getTime() + 172800000).toISOString(), 
        location: 'Shipping Hub',
        description: 'Package has been shipped'
      });
    }
    
    if (status === 'delivered') {
      events.push({ 
        status: 'Delivered', 
        date: new Date(new Date(orderDate).getTime() + 604800000).toISOString(), 
        location: 'Customer Address',
        description: 'Package has been delivered'
      });
    }
    
    return events;
  }

  private createSampleOrders(): Order[] {
    const sampleOrders: Order[] = [
      {
        id: 'ORD-1700000000000',
        orderNumber: 'ORD-123456',
        date: '2024-01-15T10:30:00Z',
        status: 'delivered',
        items: [
          {
            id: 'ITEM-101-1',
            productId: '101',
            product: {
              id: '101',
              name: 'Wireless Headphones Pro',
              price: 199.99,
              image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
              categoryId: 1,
              description: 'High-quality wireless headphones with noise cancellation',
              stock: 50
            },
            quantity: 1,
            price: 199.99,
            subtotal: 199.99
          }
        ],
        subtotal: 199.99,
        shipping: 0,
        tax: 28.00,
        total: 227.99,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          street: '123 Main Street',
          city: 'Cairo',
          state: 'Cairo',
          zipCode: '11511',
          country: 'Egypt',
          phone: '+201012345678',
          email: 'ahmed@example.com'
        },
        paymentMethod: 'credit_card',
        paymentStatus: 'paid',
        payment: {
          method: 'Credit Card',
          status: 'paid',
          transactionId: 'TXN-789012',
          paymentDate: '2024-01-15T10:35:00Z'
        },
        customerId: 1,
        customerName: 'Ahmed Mohamed',
        customerEmail: 'ahmed@example.com',
        notes: 'Please deliver before 5 PM',
        estimatedDelivery: '2024-01-22T10:30:00Z',
        trackingNumber: 'UPS123456789',
        carrier: 'UPS'
      }
    ];
    
    this.saveOrders(sampleOrders);
    return sampleOrders;
  }
}