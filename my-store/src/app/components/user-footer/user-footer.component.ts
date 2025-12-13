import { Component } from '@angular/core';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html'
})
export class UserFooterComponent {
  currentYear = new Date().getFullYear();
}