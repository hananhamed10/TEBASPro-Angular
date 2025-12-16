import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from '../../../core/services/order.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Order } from '../../../core/models/model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html'
})
export class OrdersListPage implements OnInit, OnDestroy {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = true;
  searchTerm = '';
  searchControl = new FormControl();
  activeFilter = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  
  // Modal
  selectedOrder: Order | null = null;
  cancelModal: bootstrap.Modal | null = null;
  
  // Success message after checkout
  showSuccessMessage = false;
  successOrderNumber = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['success'] === 'true' && params['orderNumber']) {
        this.showSuccessMessage = true;
        this.successOrderNumber = params['orderNumber'];
        
   
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 5000);
      }
    });
    
    this.loadOrders();
    
   
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.searchTerm = value;
        this.searchOrders();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (data) => {
        this.orders = data || [];
        this.filteredOrders = [...this.orders];
        this.totalItems = this.orders.length;
        this.loading = false;
        this.currentPage = 1;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.orders = [];
        this.filteredOrders = [];
        this.totalItems = 0;
        this.loading = false;
      }
    });
  }

  filterOrders(status: string) {
    this.activeFilter = status;
    this.currentPage = 1;
    
    if (status === 'all') {
      this.filteredOrders = [...this.orders];
      this.totalItems = this.orders.length;
    } else {
      this.filteredOrders = this.orders.filter(order => order.status === status);
      this.totalItems = this.filteredOrders.length;
    }
  }

  searchOrders() {
    if (!this.searchTerm?.trim()) {
      this.filteredOrders = [...this.orders];
      this.totalItems = this.orders.length;
      this.currentPage = 1;
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order => 
      order?.orderNumber?.toLowerCase().includes(term) ||
      order?.id?.toLowerCase().includes(term) ||
      (order?.items && order.items.some(item => 
        item?.product?.name?.toLowerCase().includes(term)
      ))
    );
    this.totalItems = this.filteredOrders.length;
    this.currentPage = 1;
  }

  
  get paginatedOrders(): Order[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredOrders.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    
    if (this.totalPages <= maxVisible) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }

 
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

 
  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'bg-warning text-dark',
      'processing': 'bg-primary text-white',
      'shipped': 'bg-info text-white',
      'delivered': 'bg-success text-white',
      'cancelled': 'bg-danger text-white'
    };
    return `badge ${classes[status] || 'bg-secondary text-white'}`;
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'pending': 'fas fa-clock',
      'processing': 'fas fa-cog fa-spin',
      'shipped': 'fas fa-shipping-fast',
      'delivered': 'fas fa-check-circle',
      'cancelled': 'fas fa-times-circle'
    };
    return icons[status] || 'fas fa-question-circle';
  }

  getCountByStatus(status: string): number {
    return this.orders.filter(order => order.status === status).length;
  }

  // Order actions
  viewOrder(id: string) {
    this.router.navigate(['/orders', id]);
  }

  trackOrder(id: string) {
    this.router.navigate(['/track-order', id]);
  }

  cancelOrder(orderId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.selectedOrder = this.orders.find(o => o.id === orderId) || null;
    
    const modalElement = document.getElementById('cancelOrderModal');
    if (modalElement) {
      this.cancelModal = new bootstrap.Modal(modalElement);
      this.cancelModal.show();
    }
  }

  confirmCancelOrder() {
    if (this.selectedOrder) {
      this.orderService.cancelOrder(this.selectedOrder.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.loadOrders();
            this.cancelModal?.hide();
            // يمكنك استخدام notification service هنا
            alert('Order cancelled successfully');
          }
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Error cancelling order');
        }
      });
    }
  }

  reorder(orderId: string, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    
    this.orderService.reorder(orderId).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/cart']);
          alert('Items added to cart successfully');
        }
      },
      error: (error) => {
        console.error('Error reordering:', error);
        alert('Error adding items to cart');
      }
    });
  }

  
  getOrderTotal(order: Order | null): number {
    if (!order) return 0;
    return order.total || 
           (order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0);
  }

  getFirstProductImage(order: Order): string {
    if (!order?.items || order.items.length === 0) {
      return 'assets/images/product-placeholder.jpg';
    }
    return order.items[0]?.product?.image || 'assets/images/product-placeholder.jpg';
  }

  getProductNames(order: Order): string {
    if (!order?.items || order.items.length === 0) return '';
    
    if (order.items.length === 1) {
      return order.items[0]?.product?.name || 'Product';
    }
    
    return `${order.items[0]?.product?.name || 'Product'} + ${order.items.length - 1} more`;
  }


  closeSuccessMessage() {
    this.showSuccessMessage = false;
  }

  
  exportOrders() {
  
    alert('Export feature coming soon!');
  }

  // Refresh orders
  refreshOrders() {
    this.loadOrders();
  }

  // Clear search
  clearSearch() {
    this.searchControl.setValue('');
    this.searchTerm = '';
    this.filteredOrders = [...this.orders];
    this.totalItems = this.orders.length;
    this.currentPage = 1;
  }
}