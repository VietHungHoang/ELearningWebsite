import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService, SupportedCurrency } from '../../services/currency.service';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: false // Makes pipe reactive to currency changes
})
export class CurrencyFormatPipe implements PipeTransform {

  constructor(private currencyService: CurrencyService) {}

  /**
   * Transform amount to current currency format
   * @param value - Amount to format
   * @param sourceCurrency - Source currency of the amount (default: USD)
   * @returns Formatted currency string
   */
  transform(value: number | null | undefined, sourceCurrency: SupportedCurrency = 'USD'): string {
    if (value === null || value === undefined || isNaN(value)) {
      return this.currencyService.getCurrencySymbol() + '0';
    }

    return this.currencyService.format(value, sourceCurrency);
  }
}
