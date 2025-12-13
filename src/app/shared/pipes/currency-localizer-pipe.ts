import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyLocalizer'
})
export class CurrencyLocalizerPipe implements PipeTransform {

  transform(countryCode: string): string {
    const countryCurrencyMap: { [key: string]: string } = {
      'US': '$',
      'NG': '₦',
    };
    if (countryCode in countryCurrencyMap) {
      return countryCurrencyMap[countryCode];
    } else {
      return '$';
    }
  }

}
