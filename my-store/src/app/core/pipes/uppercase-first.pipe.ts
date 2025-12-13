// pipes/uppercase-first.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uppercaseFirst' })
export class UppercaseFirstPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Uppercase only first letter, keep rest as is
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
