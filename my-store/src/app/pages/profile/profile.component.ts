import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  profileFields = [
    { label: 'Full Name', value: 'Hanan Hamed' },
    { label: 'Email', value: 'hananhamed@example.com' },
    { label: 'Phone', value: '+20 01126653365' },
    { label: 'Location', value: 'portsaid, Egypt' },
    { label: 'Member Since', value: 'January 13, 2023' }
  ];

  accountSettings = [
    { name: 'Notification Settings', icon: 'fas fa-bell' },
    { name: 'Privacy & Security', icon: 'fas fa-shield-alt' },
    { name: 'Billing Information', icon: 'fas fa-credit-card' },
    { name: 'Language Preferences', icon: 'fas fa-language' }
  ];
}