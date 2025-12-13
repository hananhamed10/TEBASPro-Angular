// pipes/currency.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customCurrency' })
export class CustomCurrencyPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'USD'): string {
    if (!value) return '';
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2
    });
    
    return formatter.format(value);
  }
}