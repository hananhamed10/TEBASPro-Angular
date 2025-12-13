// pipes/capitalize.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'capitalize' })
export class CapitalizePipe implements PipeTransform {
  transform(value: string, allWords: boolean = false): string {
    if (!value) return '';
    
    if (allWords) {
      // Capitalize first letter of every word
      return value.replace(/\b\w/g, char => char.toUpperCase());
    } else {
      // Capitalize only first letter of the string
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
  }
}
