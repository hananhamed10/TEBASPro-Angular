import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // ⭐ مهم نضيف ده

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  successMessage = '';
  showEmailVerification = false;
  progressValue = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // ⭐ نضيف الـ AuthService هنا
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^01[0-2]{1}[0-9]{8}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    console.log('🎯 الزرار اتداس عليه!');
    
    if (this.registerForm.valid) {
      this.loading = true;
      this.successMessage = '';
      this.showEmailVerification = false;
      this.progressValue = 0;
      
      // محاكاة progress bar
      const progressInterval = setInterval(() => {
        this.progressValue += 10;
        if (this.progressValue >= 100) {
          clearInterval(progressInterval);
        }
      }, 300);
      
      // محاكاة الـ API
      setTimeout(() => {
        this.loading = false;
        this.progressValue = 100;
        
        // رسالة النجاح
        this.successMessage = '🎉 Account created successfully! You are being redirected to the dashboard...';
        
        // ⭐ نستخدم الـ AuthService الجديد بدل localStorage مباشرة
        const userData = {
          firstName: this.registerForm.get('firstName')?.value,
          lastName: this.registerForm.get('lastName')?.value,
          email: this.registerForm.get('email')?.value,
          phone: this.registerForm.get('phone')?.value,
          registeredAt: new Date().toISOString()
        };
        
        // نستدعي دالة الريجستير من الـ AuthService
        const registrationSuccess = this.authService.register(userData);
        
        if (registrationSuccess) {
          // التوجيه للداشبورد بعد ٣ ثواني
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000);
        } else {
          console.error('❌ فشل في عملية التسجيل');
        }
        
      }, 3000);
    } else {
      console.log('❌ الفورم مش صحيح!', this.registerForm.errors);
      this.registerForm.markAllAsTouched();
    }
  }

  // دالة لإعادة إرسال كود التفعيل
  resendVerification(): void {
    console.log('🔄 إعادة إرسال كود التفعيل...');
    alert('تم إرسال كود التفعيل مرة أخرى إلى بريدك الإلكتروني!');
  }
}