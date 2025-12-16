import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; 

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
    private authService: AuthService 
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
console.log('🎯 Button stepped on!'); 

if (this.registerForm.valid) { 
this. loading = true; 
this.successMessage = ''; 
this.showEmailVerification = false; 
this. progressValue = 0; 


const progressInterval = setInterval(() => { 
this.progressValue += 10; 
if (this.progressValue >= 100) { 
clearInterval(progressInterval); 
} 
}, 300); 


setTimeout(() => { 
this. loading = false; 
this. progressValue = 100; 


this.successMessage = '🎉 Account created successfully! You are being redirected to the dashboard...'; 


const userData = { 
firstName: this.registerForm.get('firstName')?.value, 
lastName: this.registerForm.get('lastName')?.value, 
email: this.registerForm.get('email')?.value, 
phone: this.registerForm.get('phone')?.value, 
registeredAt: new Date().toISOString() 
}; 


const registrationSuccess = this.authService.register(userData); 

if (registrationSuccess) { 

setTimeout(() => { 
this.router.navigate(['/dashboard']); 
}, 3000);

} else {
console.error('❌ Registration failed');

}

}, 3000);

} else {
console.log('❌ Form is invalid!', this.registerForm.errors);

this.registerForm.markAllAsTouched();

}

}

resendVerification(): void {
console.log('🔄 Resend activation code...');

alert('Activation code has been sent back to your email!');

}
}