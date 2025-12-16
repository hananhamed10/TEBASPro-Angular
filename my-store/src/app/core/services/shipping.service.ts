import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  constructor() {}

  getShippingMethods(): Observable<any[]> {

    return of([
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: 'Delivery in 5-7 business days',
        price: 4.99,
        estimatedDays: 7,
        freeThreshold: 50.00
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Delivery in 2-3 business days',
        price: 9.99,
        estimatedDays: 3,
        freeThreshold: 100.00
      },
      {
        id: 'nextday',
        name: 'Next Day Delivery',
        description: 'Delivery next business day',
        price: 19.99,
        estimatedDays: 1,
        freeThreshold: 150.00
      },
      {
        id: 'pickup',
        name: 'Store Pickup',
        description: 'Pick up from nearest store',
        price: 0.00,
        estimatedDays: 0,
        freeThreshold: 0.00,
        pickupLocations: [
          'Downtown Store - 123 Main St',
          'Mall Location - 456 Mall Ave',
          'Northside Store - 789 North Rd'
        ]
      }
    ]);
  }

  trackShipment(trackingNumber: string): Observable<any> {
    // Generate sample tracking info based on tracking number
    const statuses = ['pending', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const tracking = {
      trackingNumber: trackingNumber,
      status: randomStatus,
      carrier: this.getCarrierFromNumber(trackingNumber),
      service: 'Standard Shipping',
      estimatedDelivery: this.getFutureDate(3),
      destination: '123 Main St, New York, NY 10001',
      weight: '1.5 kg',
      dimensions: '30 × 20 × 10 cm',
      updates: this.generateTrackingUpdates(randomStatus)
    };
    
    return of(tracking);
  }

  calculateShipping(address: any): Observable<any> {
   
    const basePrice = address.country === 'USA' ? 4.99 : 14.99;
    const expressPrice = address.country === 'USA' ? 9.99 : 24.99;
    
    const methods = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        price: basePrice,
        estimatedDays: address.country === 'USA' ? 7 : 14
      },
      {
        id: 'express',
        name: 'Express Shipping',
        price: expressPrice,
        estimatedDays: address.country === 'USA' ? 3 : 7
      }
    ];
    
    return of(methods);
  }

  getShippingAddresses(): Observable<any[]> {
    const addresses = localStorage.getItem('shipping_addresses');
    if (addresses) {
      return of(JSON.parse(addresses));
    }
    
    // Return sample addresses
    const sampleAddresses = [
      {
        id: '1',
        isDefault: true,
        name: 'Home',
        fullName: 'John Doe',
        street: '123 Main Street',
        apartment: 'Apt 4B',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        phone: '123-456-7890'
      },
      {
        id: '2',
        isDefault: false,
        name: 'Work',
        fullName: 'John Doe',
        street: '456 Office Blvd',
        apartment: 'Suite 300',
        city: 'New York',
        state: 'NY',
        zipCode: '10005',
        country: 'USA',
        phone: '987-654-3210'
      }
    ];
    
    localStorage.setItem('shipping_addresses', JSON.stringify(sampleAddresses));
    return of(sampleAddresses);
  }

  addShippingAddress(address: any): Observable<any> {
    const addresses = this.getAddressesFromStorage();
    
   
    if (address.isDefault || addresses.length === 0) {
      addresses.forEach(addr => addr.isDefault = false);
      address.isDefault = true;
    }
    
    address.id = 'ADDR-' + Date.now();
    addresses.push(address);
    this.saveAddresses(addresses);
    
    return of({ success: true, address: address });
  }

  updateShippingAddress(addressId: string, addressData: any): Observable<any> {
    const addresses = this.getAddressesFromStorage();
    const index = addresses.findIndex(addr => addr.id === addressId);
    
    if (index !== -1) {
      addresses[index] = { ...addresses[index], ...addressData };
      
      // If setting as default, update others
      if (addressData.isDefault) {
        addresses.forEach((addr, i) => {
          if (i !== index) addr.isDefault = false;
        });
      }
      
      this.saveAddresses(addresses);
      return of({ success: true });
    }
    
    return of({ success: false, message: 'Address not found' });
  }

  deleteShippingAddress(addressId: string): Observable<any> {
    const addresses = this.getAddressesFromStorage();
    const filteredAddresses = addresses.filter(addr => addr.id !== addressId);
    
    
    if (filteredAddresses.length > 0 && !filteredAddresses.some(addr => addr.isDefault)) {
      filteredAddresses[0].isDefault = true;
    }
    
    this.saveAddresses(filteredAddresses);
    
    return of({ success: true, message: 'Address deleted' });
  }

  private getCarrierFromNumber(trackingNumber: string): string {
    if (trackingNumber.startsWith('UPS')) return 'UPS';
    if (trackingNumber.startsWith('FEDEX')) return 'FedEx';
    if (trackingNumber.startsWith('USPS')) return 'USPS';
    if (trackingNumber.startsWith('DHL')) return 'DHL';
    return 'Standard Carrier';
  }

  private getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  private generateTrackingUpdates(status: string): any[] {
    const updates = [
      {
        status: 'Label Created',
        date: new Date(Date.now() - 86400000 * 3).toISOString(),
        location: 'Shipping Facility',
        description: 'Shipping label has been created'
      },
      {
        status: 'Package Received',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        location: 'Distribution Center',
        description: 'Package received at facility'
      }
    ];
    
    if (status === 'shipped' || status === 'out_for_delivery' || status === 'delivered') {
      updates.push({
        status: 'Departed Facility',
        date: new Date(Date.now() - 86400000).toISOString(),
        location: 'Transit Hub',
        description: 'Package is in transit'
      });
    }
    
    if (status === 'out_for_delivery' || status === 'delivered') {
      updates.push({
        status: 'Out for Delivery',
        date: new Date(Date.now() - 3600000).toISOString(),
        location: 'Local Facility',
        description: 'Package is out for delivery'
      });
    }
    
    if (status === 'delivered') {
      updates.push({
        status: 'Delivered',
        date: new Date().toISOString(),
        location: 'Customer Address',
        description: 'Package delivered successfully',
      });
    }
    
    return updates;
  }

  private getAddressesFromStorage(): any[] {
    const addresses = localStorage.getItem('shipping_addresses');
    return addresses ? JSON.parse(addresses) : [];
  }

  private saveAddresses(addresses: any[]): void {
    localStorage.setItem('shipping_addresses', JSON.stringify(addresses));
  }
}