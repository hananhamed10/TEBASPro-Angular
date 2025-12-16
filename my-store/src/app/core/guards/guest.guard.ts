import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    
    const isLoggedIn = localStorage.getItem('token');
    
    if (!isLoggedIn) {
      return true; 
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}