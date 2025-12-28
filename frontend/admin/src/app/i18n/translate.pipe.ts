import { Pipe, PipeTransform, inject, ChangeDetectorRef, effect } from '@angular/core';
import { I18nService } from './i18n.service';

@Pipe({
  name: 'translate',
  pure: false,
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  private i18nService = inject(I18nService);
  private cdr = inject(ChangeDetectorRef);
  private lastKey: string = '';
  private lastValue: string = '';

  constructor() {
    // Watch for language changes
    effect(() => {
      this.i18nService.currentLanguage$();
      if (this.lastKey) {
        this.lastValue = this.i18nService.translate(this.lastKey);
        this.cdr.markForCheck();
      }
    });
  }

  transform(key: string, params?: { [key: string]: string | number }): string {
    if (!key) {
      return '';
    }

    // Always get fresh translation value
    this.lastKey = key;
    this.lastValue = this.i18nService.translate(key, params);

    return this.lastValue;
  }
}

