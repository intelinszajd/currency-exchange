import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChange,
} from '@angular/core';
import { currencyApiResponseType, CurrencyType } from '../api.service';

@Component({
  selector: 'app-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss'],
})
export class CurrencySelectorComponent {
  public currencies: CurrencyType[] = [];

  @Input()
  currencyData: currencyApiResponseType | undefined;
  @Output()
  updateCurrentCurrency = new EventEmitter<CurrencyType>();

  public currentCurrency = this.currencies[0];

  constructor() {}

  onChange(currencyValue: CurrencyType) {
    this.updateCurrentCurrency.emit(currencyValue);
  }

  public ngOnChanges(change: any) {
    if (change && change.currencyData && change.currencyData.currentValue) {
      let rates = change.currencyData.currentValue.rates;
      for (const key in rates) {
        this.currencies.push({ name: key, rate: rates[key] });
      }
    }
  }
}
