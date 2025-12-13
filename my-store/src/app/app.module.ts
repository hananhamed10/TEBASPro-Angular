import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Components
import { AppComponent } from './app.component';

// Existing Pages
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProductComponent } from './pages/product/product.component';
import { CategoryComponent } from './pages/category/category.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/payment/checkout/checkout.component';
import { CategoryDetailsComponent } from './pages/category-details/category-details.component';
import { CategoryProductsComponent } from './pages/category-products/category-products.component';

// New Pages - Wishlist
import { WishlistPage } from './pages/wishlist/wishlist/wishlist.component';

// New Pages - Orders
import { OrdersListPage } from './pages/orders/orders-list/orders-list.component';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details.component';
import { TrackOrderPage } from './pages/orders/track-order/track-order.component';

// New Pages - Payment
import { PaymentMethodsPage } from './pages/payment/payment-methods/payment-methods.component';
import { PaymentSuccessPage } from './pages/payment/payment-success/payment-success.component';
// import { PaymentFailedPage } from './pages/payment/payment-failed/payment-failed.component';

// New Pages - Notifications
import { NotificationsPage } from './pages/notifications/notifications/notifications.component';

// New Pages - Reviews
import { ProductReviewsPage } from './pages/reviews/product-reviews/product-reviews.component';  
import { WriteReviewPage } from './pages/reviews/write-review/write-review.component';

// New Pages - Shipping
import { ShippingMethodsPage } from './pages/shipping/shipping-methods/shipping-methods.component';
import { TrackShipmentPage } from './pages/shipping/track-shipment/track-shipment.component'; 

// Layouts
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';

// Components
import { AuthNavbarComponent } from './components/auth-nav/auth-nav.component';
import { UserNavbarComponent } from './components/user-nav/user-nav.component';
import { AuthFooterComponent } from './components/auth-footer/auth-footer.component';
import { UserFooterComponent } from './components/user-footer/user-footer.component';

// Pipes
import { CapitalizePipe } from './core/pipes/capitalize.pipe';
import { UppercaseFirstPipe } from './core/pipes/uppercase-first.pipe';
import { CustomCurrencyPipe } from './core/pipes/currency-format.pipe';
import { DateFormatPipe } from './core/pipes/date-format.pipe';
import { TruncatePipe } from './core/pipes/truncate.pipe';

// Services
import { CategoryService } from './core/services/category.service';
import { AuthService } from './core/services/auth.service';
import { ProductService } from './core/services/product.service';
import { WishlistService } from './core/services/wishlist.service';
import { OrderService } from './core/services/order.service';
import { PaymentService } from './core/services/payment.service';
import { NotificationService } from './core/services/notification.service';
import { ReviewService } from './core/services/review.service';
import { ShippingService } from './core/services/shipping.service';
import { CartService } from './core/services/cart.service';

// Guards
import { AuthGuard } from './core/guards/auth.guard';
import { GuestGuard } from './core/guards/guest.guard';

// ⚠️ **تحديد الـ Routes بشكل صحيح بدون lazy loading للأوردر ديتيلز**
const routes: Routes = [
  // ===== PUBLIC ROUTES (No Auth Required) =====
  { 
    path: 'home', 
    component: HomeComponent 
  },
  
  // Product Details
  { 
    path: 'products/:id', 
    component: ProductDetailsComponent 
  },
  
  // Product Reviews
  { 
    path: 'product/:id/reviews', 
    component: ProductReviewsPage 
  },
  
  // Categories
  { 
    path: 'categories/:id', 
    component: CategoryDetailsComponent 
  },
  { 
    path: 'categories/:id/products', 
    component: CategoryProductsComponent 
  },
  
  // Cart
  { 
    path: 'cart', 
    component: CartComponent 
  },
  
  // Payment Results (Public)
  { 
    path: 'payment-success', 
    component: PaymentSuccessPage 
  },
  
  // { 
  //   path: 'payment-failed', 
  //   component: PaymentFailedPage 
  // },
  
  // Auth Pages (Only for guests)
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },
  
  // ===== PROTECTED ROUTES (Auth Required) =====
  // Checkout (محمي)
  { 
    path: 'checkout', 
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  
  // Protected Routes with User Layout
  { 
    path: '', 
    component: UserLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      // Dashboard
      { 
        path: 'dashboard', 
        component: DashboardComponent 
      },
      
      // Profile
      { 
        path: 'profile', 
        component: ProfileComponent 
      },
      
      // Products & Categories
      { 
        path: 'products', 
        component: ProductComponent 
      },
      { 
        path: 'categories', 
        component: CategoryComponent 
      },
      
      // Orders
      { 
        path: 'orders', 
        component: OrdersListPage 
      },
      { 
        path: 'orders/:id', 
        component: OrderDetailsComponent 
      },
      { 
        path: 'track-order/:id', 
        component: TrackOrderPage 
      },
      
      // Wishlist
      { 
        path: 'wishlist', 
        component: WishlistPage 
      },
      
      // Payment Methods
      { 
        path: 'payment-methods', 
        component: PaymentMethodsPage 
      },
      
      // Notifications
      { 
        path: 'notifications', 
        component: NotificationsPage 
      },
      
      // Reviews
      { 
        path: 'write-review', 
        component: WriteReviewPage 
      },
      
      // Shipping
      { 
        path: 'shipping-methods', 
        component: ShippingMethodsPage 
      },
      { 
        path: 'track-shipment/:id', 
        component: TrackShipmentPage 
      }
    ]
  },
  
  // Default Route
  { 
    path: '', 
    redirectTo: '/home', 
    pathMatch: 'full' 
  },
  
  // 404 Route
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];

@NgModule({
  declarations: [
    // Main App
    AppComponent,
    
    // Existing Pages
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    ProductComponent,
    CategoryComponent,
    ProductDetailsComponent,
    CartComponent,
    CheckoutComponent,
    OrderDetailsComponent,
    CategoryDetailsComponent,
    CategoryProductsComponent,
    
    // New Pages
    WishlistPage,
    OrdersListPage,
    TrackOrderPage,
    PaymentMethodsPage,
    PaymentSuccessPage,
    // PaymentFailedPage,
    NotificationsPage,
    ProductReviewsPage,
    WriteReviewPage,
    ShippingMethodsPage,
    TrackShipmentPage,
    
    // Layouts
    AuthLayoutComponent,
    UserLayoutComponent,
    
    // Shared Components
    AuthNavbarComponent,
    UserNavbarComponent,
    AuthFooterComponent,
    UserFooterComponent,

    // Pipes
    CapitalizePipe,
    UppercaseFirstPipe,
    CustomCurrencyPipe,
    DateFormatPipe,
    TruncatePipe
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      onSameUrlNavigation: 'reload'
    })
  ],
  providers: [
    // Services
    CategoryService,
    AuthService,
    ProductService,
    CartService,
    WishlistService,
    OrderService,
    PaymentService,
    NotificationService,
    ReviewService,
    ShippingService,
    
    // Guards
    AuthGuard,
    GuestGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }