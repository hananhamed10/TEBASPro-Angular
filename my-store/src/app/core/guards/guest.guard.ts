import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // تحقق بسيط - عدليه بعد كده علشان ي check مع الـ auth service
    const isLoggedIn = localStorage.getItem('token');
    
    if (!isLoggedIn) {
      return true; // يسمح للزوار
    } else {
      this.router.navigate(['/dashboard']);
      return false;
    }
  }
}