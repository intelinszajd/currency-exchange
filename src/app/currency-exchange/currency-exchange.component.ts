import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';
import {
  ApiService,
  currencyApiResponseType,
  CurrencyType,
} from '../api.service';

export type CurrencyExchangeFormType = {
  priceInput: number;
  currencyName: string;
};

@Component({
  selector: 'app-currency-exchange',
  templateUrl: './currency-exchange.component.html',
  styleUrls: ['./currency-exchange.component.scss'],
})
export class CurrencyExchangeComponent implements OnInit {
  public currencyExchangeForm: FormGroup = new FormGroup({
    inputCurrency: new FormControl(),
    currencySelector: new FormControl(),
  });
  public apiCurrencyData: currencyApiResponseType | undefined;
  public directConvertedPrice = '';
  public convertedPrice = '';
  public hiddenPrice = '';
  public currentPrice = 0;
  public inputCurrency: CurrencyType | undefined;
  public outputCurrency: CurrencyType | undefined;
  public baseCurrency = environment.baseCurrency;

  constructor(private formBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.currencyExchangeForm = this.formBuilder.group({
      priceInput: this.currentPrice,
    });

    this.api.getCurrencies(this.baseCurrency).subscribe((data: any) => {
      this.apiCurrencyData = data;
    });
  }

  updateInputCurrency(currency: CurrencyType) {
    this.inputCurrency = currency;
  }

  updateOutputCurrency(currency: CurrencyType) {
    this.outputCurrency = currency;
  }

  doConversion(values: CurrencyExchangeFormType) {
    if (this.inputCurrency && this.outputCurrency) {
      let priceWithHidden =
        (values.priceInput /
          (this.inputCurrency.rate / environment.mockHandlingFee)) *
        this.outputCurrency.rate;
      this.api
        .getCurrencyConversion(this.inputCurrency, this.outputCurrency)
        .subscribe((data: any) => {
          if (data.result) {
            let direct = values.priceInput * data.result;
            let hidden = priceWithHidden - direct;

            this.updateDisplayPrices(
              direct,
              priceWithHidden,
              hidden,
              this.outputCurrency
            );
          }
        });
    }
  }

  updateDisplayPrices(
    direct: number,
    converted: number,
    hidden: number,
    targetCurrency?: CurrencyType
  ) {
    if (targetCurrency) {
      this.convertedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: targetCurrency.name,
      }).format(converted);
      this.hiddenPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: targetCurrency.name,
      }).format(hidden);
      this.directConvertedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: targetCurrency.name,
      }).format(direct);
    }
  }
}
