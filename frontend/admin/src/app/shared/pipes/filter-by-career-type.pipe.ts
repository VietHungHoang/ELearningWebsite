import { Pipe, PipeTransform } from '@angular/core';
import { CareerEntry } from '../../types/instructor';

@Pipe({
    name: 'filterByCareerType',
    standalone: true
})
export class FilterByCareerTypePipe implements PipeTransform {
    transform(entries: CareerEntry[] | null | undefined, type: 'EDUCATION' | 'EXPERIENCE'): CareerEntry[] {
        if (!entries) return [];
        return entries.filter(entry => entry.type === type);
    }
}
