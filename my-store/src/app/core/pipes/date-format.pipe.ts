// pipes/date-format.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat' })
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date, format: string = 'medium'): string {
    if (!value) return '';
    
    const date = new Date(value);
    
    switch (format) {
      case 'short':
        return date.toLocaleDateString('en-US');
      case 'medium':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        });
      case 'long':
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      default:
        return date.toLocaleDateString('en-US');
    }
  }
}