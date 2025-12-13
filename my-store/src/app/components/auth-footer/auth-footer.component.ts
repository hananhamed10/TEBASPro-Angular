import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-footer',
  templateUrl: './auth-footer.component.html'
})
export class AuthFooterComponent {
  currentYear = new Date().getFullYear();
}