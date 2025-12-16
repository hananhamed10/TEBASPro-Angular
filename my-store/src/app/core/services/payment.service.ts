import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private storageKey = 'payment_methods';
  private transactionsKey = 'payment_transactions';

  constructor() {}

 
  processPayment(paymentData: any, paymentMethod: string): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        let success: boolean;
        let message: string;
        
     
        switch(paymentMethod) {
          case 'creditCard':
            success = Math.random() > 0.2; 
            message = success ? 'Credit card payment successful' : 'Credit card payment declined';
            break;
          case 'vodafoneCash':
            success = Math.random() > 0.1; 
            message = success ? 'Vodafone Cash payment successful' : 'Vodafone Cash payment failed';
            break;
          case 'instapay':
            success = Math.random() > 0.15; 
            message = success ? 'Instapay payment successful' : 'Instapay payment failed';
            break;
          default:
            success = Math.random() > 0.1; 
            message = success ? 'Payment successful' : 'Payment failed';
        }
        
        if (success) {
          const transactionId = 'TXN-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
          
          
          const transaction = {
            id: transactionId,
            orderId: paymentData.orderId,
            orderNumber: paymentData.orderNumber,
            amount: paymentData.amount || paymentData.totalAmount,
            paymentMethod: paymentMethod,
            status: 'completed',
            date: new Date().toISOString(),
            customerEmail: paymentData.customerEmail,
            transactionDetails: paymentData.transactionDetails || {}
          };
          
          this.saveTransaction(transaction);
          
          observer.next({
            success: true,
            message: message,
            transactionId: transactionId,
            orderId: paymentData.orderId,
            orderNumber: paymentData.orderNumber,
            paymentMethod: paymentMethod,
            amount: paymentData.amount
          });
        } else {
          observer.next({
            success: false,
            message: message,
            paymentMethod: paymentMethod
          });
        }
        observer.complete();
      }, paymentMethod === 'cash' ? 500 : 2000); 
    });
  }


  processCashPayment(orderData: any): Observable<any> {
    return of({
      success: true,
      message: 'Order confirmed. Pay when you receive your order.',
      paymentMethod: 'cash',
      orderId: orderData.orderId,
      orderNumber: orderData.orderNumber,
      expectedDelivery: this.getFutureDate(3) 
    });
  }

 
  getVodafoneCashDetails(): Observable<any> {
    return of({
      vodafoneNumber: '01012345678',
      accountName: 'Your Store Name',
      instructions: [
        'Send payment to the Vodafone Cash number above',
        'Use your order number as the payment note',
        'Screenshot the payment confirmation',
        'Upload screenshot in order tracking page'
      ]
    });
  }

  
  getInstapayDetails(): Observable<any> {
    return of({
      bankName: 'CIB',
      accountNumber: '1234567890',
      accountName: 'Your Store Name',
      swiftCode: 'CIBEEGCX',
      instructions: [
        'Transfer amount to the bank account above',
        'Use Instapay through your banking app',
        'Use order number as reference',
        'Keep transaction receipt'
      ]
    });
  }

  
  checkPaymentStatus(orderId: string): Observable<any> {
    const transactions = this.getTransactionsFromStorage();
    const transaction = transactions.find(t => t.orderId === orderId);
    
    return of(transaction || {
      orderId: orderId,
      status: 'pending',
      message: 'Payment not yet processed'
    });
  }

  getPaymentMethods(): Observable<any[]> {
    const methods = localStorage.getItem(this.storageKey);
    if (methods) {
      return of(JSON.parse(methods));
    }
    
    
    const sampleMethods = [
      {
        id: '1',
        type: 'card',
        provider: 'Visa',
        details: '**** 1234',
        lastFour: '1234',
        isDefault: true,
        expires: '12/25',
        cardHolder: 'Customer Name'
      },
      {
        id: '2',
        type: 'vodafoneCash',
        provider: 'Vodafone',
        details: '010******78',
        phone: '01012345678',
        isDefault: false
      },
      {
        id: '3',
        type: 'instapay',
        provider: 'Bank Transfer',
        details: 'CIB - 1234****',
        accountLastFour: '5678',
        isDefault: false
      },
      {
        id: '4',
        type: 'cash',
        provider: 'Cash on Delivery',
        details: 'Pay when you receive',
        isDefault: false
      }
    ];
    
    this.savePaymentMethods(sampleMethods);
    return of(sampleMethods);
  }

  getPaymentDetails(transactionId: string): Observable<any> {
    const transactions = this.getTransactionsFromStorage();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (transaction) {
      return of(transaction);
    }
    
   
    return of({
      transactionId: transactionId,
      status: 'completed',
      amount: 99.99,
      currency: 'EGP',
      date: new Date().toISOString(),
      orderId: 'ORD-' + Math.floor(Math.random() * 10000),
      paymentMethod: 'Visa **** 1234'
    });
  }

  addPaymentMethod(methodData: any): Observable<any> {
    const methods = this.getMethodsFromStorage();
    const newMethod = {
      id: 'PM-' + Date.now(),
      ...methodData,
      isDefault: methods.length === 0
    };
    
    methods.push(newMethod);
    this.savePaymentMethods(methods);
    
    return of({ success: true, method: newMethod });
  }

  deletePaymentMethod(methodId: string): Observable<any> {
    const methods = this.getMethodsFromStorage();
    const filteredMethods = methods.filter(m => m.id !== methodId);
    
    if (filteredMethods.length > 0 && !filteredMethods.some(m => m.isDefault)) {
      filteredMethods[0].isDefault = true;
    }
    
    this.savePaymentMethods(filteredMethods);
    
    return of({ success: true, message: 'Payment method deleted' });
  }

  setDefaultPaymentMethod(methodId: string): Observable<any> {
    const methods = this.getMethodsFromStorage();
    
    methods.forEach(method => {
      method.isDefault = method.id === methodId;
    });
    
    this.savePaymentMethods(methods);
    return of({ success: true, message: 'Default payment method updated' });
  }

  
  private saveTransaction(transaction: any): void {
    const transactions = this.getTransactionsFromStorage();
    transactions.push(transaction);
    localStorage.setItem(this.transactionsKey, JSON.stringify(transactions));
  }

  private getTransactionsFromStorage(): any[] {
    const transactions = localStorage.getItem(this.transactionsKey);
    return transactions ? JSON.parse(transactions) : [];
  }

  private getMethodsFromStorage(): any[] {
    const methods = localStorage.getItem(this.storageKey);
    return methods ? JSON.parse(methods) : [];
  }

  private savePaymentMethods(methods: any[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(methods));
  }

  private getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0]; 
  }
}