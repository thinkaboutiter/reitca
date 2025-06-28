export const formatCurrency = (amount, currency, locale = 'bg-BG') => {
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
};

export const formatPercentage = (value, decimals = 1) => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value, decimals = 2, locale = 'bg-BG') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
};