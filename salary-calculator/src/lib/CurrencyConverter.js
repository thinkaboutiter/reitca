export class CurrencyConverter {
  constructor(countryConfig) {
    this.config = countryConfig;
  }

  convert(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return amount;
    }

    // Convert from base currency to target currency
    if (fromCurrency === this.config.currency) {
      const rate = this.config.exchangeRates[toCurrency];
      return rate ? amount / rate : amount;
    }

    // Convert from foreign currency to base currency
    if (toCurrency === this.config.currency) {
      const rate = this.config.exchangeRates[fromCurrency];
      return rate ? amount * rate : amount;
    }

    // Convert between two foreign currencies (via base currency)
    const fromRate = this.config.exchangeRates[fromCurrency];
    const toRate = this.config.exchangeRates[toCurrency];
    
    if (fromRate && toRate) {
      const baseAmount = amount * fromRate;
      return baseAmount / toRate;
    }

    return amount; // Fallback if rates not found
  }

  formatCurrency(amount, currency, locale = 'bg-BG') {
    // Handle different locales based on currency
    const localeMap = {
      'BGN': 'bg-BG',
      'EUR': 'de-DE',
      'USD': 'en-US'
    };

    const formatLocale = localeMap[currency] || locale;
    
    return new Intl.NumberFormat(formatLocale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }

  getExchangeRate(fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    if (fromCurrency === this.config.currency) {
      return this.config.exchangeRates[toCurrency] || 1;
    }

    if (toCurrency === this.config.currency) {
      return 1 / (this.config.exchangeRates[fromCurrency] || 1);
    }

    // Cross-currency conversion
    const fromRate = this.config.exchangeRates[fromCurrency];
    const toRate = this.config.exchangeRates[toCurrency];
    
    if (fromRate && toRate) {
      return fromRate / toRate;
    }

    return 1; // Fallback
  }

  getSupportedCurrencies() {
    return [this.config.currency, ...Object.keys(this.config.exchangeRates)];
  }
}