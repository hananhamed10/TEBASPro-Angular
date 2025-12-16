// // src/app/core/validators/custom.validators.ts
// import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// export class CustomValidators {

//   static passwordMatch(controlName: string, matchingControlName: string): ValidatorFn {
//     return (formGroup: AbstractControl): ValidationErrors | null => {
//       const control = formGroup.get(controlName);
//       const matchingControl = formGroup.get(matchingControlName);

//       if (!control || !matchingControl) {
//         return null;
//       }

//       if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
//         return null;
//       }

//       if (control.value !== matchingControl.value) {
//         matchingControl.setErrors({ passwordMismatch: true });
//         return { passwordMismatch: true };
//       } else {
//         matchingControl.setErrors(null);
//         return null;
//       }
//     };
//   }


//   static strongPassword(control: AbstractControl): ValidationErrors | null {
//     const value = control.value;
    
//     if (!value) {
//       return null;
//     }

//     const hasUpperCase = /[A-Z]/.test(value);
//     const hasLowerCase = /[a-z]/.test(value);
//     const hasNumeric = /[0-9]/.test(value);
//     const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
//     const isValidLength = value.length >= 8;

//     const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecial && isValidLength;

//     return !passwordValid ? { strongPassword: true } : null;
//   }


//   static mustBeTrue(control: AbstractControl): ValidationErrors | null {
//     return control.value === true ? null : { mustBeTrue: true };
//   }
// }