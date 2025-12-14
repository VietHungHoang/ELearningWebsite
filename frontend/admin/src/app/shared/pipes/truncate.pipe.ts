import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, startChars: number = 8, endChars: number = 4, mode: string = 'split'): string {
        if (!value) return '';

        if (mode === 'first12') {
            // Show only first 12 characters
            if (value.length <= 12) return value;
            return value.substring(0, 12) + '...';
        }

        // Original split mode
        if (value.length <= startChars + endChars + 3) return value;
        return `${value.substring(0, startChars)}...${value.substring(value.length - endChars)}`;
    }
}
