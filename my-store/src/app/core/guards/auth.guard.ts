import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true; // ✅ يسمح بالدخول لو اليوزر عامل لوجن
    } else {
      // 🔥 **التعديل هنا: نحفظ الصفحة الحالية قبل ما نروح للوجن**
      this.authService.setReturnUrl(state.url);
      
      // بيروح للوجن
      this.router.navigate(['/login']);
      return false;
    }
  }
}