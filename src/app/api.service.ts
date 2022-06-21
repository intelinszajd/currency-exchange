import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export type currencyApiResponseType = {
  base: string;
  date: string;
  motd: string[];
  rates: string[];
  success: boolean;
};

export type CurrencyType = {
  name: string;
  rate: number;
};

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  getCurrencies(
    baseCurrency: string,
    targetCurrencies?: string[]
  ): Observable<Object> {
    let url = 'https://api.exchangerate.host/latest?base={base}'.replace(
      '{base}',
      baseCurrency
    );
    if (targetCurrencies && targetCurrencies.length) {
      url += '&symbols={symbols}'.replace(
        '{symbols}',
        encodeURIComponent(targetCurrencies.toString())
      );
    }
    return this.http.get(url);
  }

  getCurrencyConversion(
    from: CurrencyType,
    to: CurrencyType
  ): Observable<Object> {
    let url = 'https://api.exchangerate.host/convert?from={from}&to={to}'
      .replace('{from}', from.name)
      .replace('{to}', to.name);
    return this.http.get(url);
  }
}
