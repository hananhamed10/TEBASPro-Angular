import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userKey = 'current_user';
  private tokenKey = 'auth_token';

  constructor(private router: Router) {}


  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }


  getUserName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'User';
  }

  getUserEmail(): string {
    const user = this.getCurrentUser();
    return user?.email || 'user@example.com';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getCurrentUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  
  login(email: string, password: string): boolean {
    
    if (!email || !password) {
      return false;
    }

 
    const user = {
      id: Date.now().toString(),
      name: 'Hanan Hamed', 
      role: 'user',
      createdAt: new Date().toISOString()
    };
    

    localStorage.setItem(this.tokenKey, 'fake-jwt-token-' + Date.now());
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
    
    const returnUrl = localStorage.getItem('returnUrl') || '/dashboard';
    localStorage.removeItem('returnUrl'); // تنظيف بعد الاستخدام
    
  
    this.router.navigate([returnUrl]);
    
    return true;
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.router.navigate(['/login']);
  }

 
  register(userData: any): boolean {
   
    if (!userData.name || !userData.email || !userData.password) {
      return false;
    }

    const user = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'user',
      phone: userData.phone || '',
      address: userData.address || '',
      createdAt: new Date().toISOString()
    };
    
   
    localStorage.setItem(this.tokenKey, 'fake-jwt-token-' + Date.now());
    localStorage.setItem(this.userKey, JSON.stringify(user));
    
   
    this.router.navigate(['/dashboard']);
    
    return true;
  }


  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  updateProfile(profileData: any): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    const updatedUser = { 
      ...user, 
      ...profileData,
      updatedAt: new Date().toISOString()
    };
    
    localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    return true;
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    
    if (oldPassword && newPassword && newPassword.length >= 6) {
      return true;
    }
    return false;
  }

  forgotPassword(email: string): boolean {
   
    if (email) {
     
      return true;
    }
    return false;
  }

  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  getUnreadNotifications(): number {
    const notifications = localStorage.getItem('notifications');
    if (notifications) {
      const allNotifications = JSON.parse(notifications);
      return allNotifications.filter((n: any) => !n.read).length;
    }
    return 0;
  }


  setReturnUrl(url: string): void {
    localStorage.setItem('returnUrl', url);
  }

  
  getReturnUrl(): string | null {
    return localStorage.getItem('returnUrl');
  }


  clearReturnUrl(): void {
    localStorage.removeItem('returnUrl');
  }

 
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isOwner(resourceUserId: string): boolean {
    const user = this.getCurrentUser();
    return user?.id === resourceUserId;
  }

 
  loadUserData(): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.getCurrentUser();
        if (user) {
          resolve(user);
        } else {
          reject('User not found');
        }
      }, 500);
    });
  }
}