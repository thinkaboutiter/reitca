import React from 'react';
import { Calculator, Euro, TrendingUp } from 'lucide-react';
import { Badge } from '../shared/Badge';

export const Header = ({ 
  selectedCountryCode,
  countryConfig,
  EUR_TO_BGN_RATE, 
  isCeilingApplied, 
  SOCIAL_SECURITY_CEILING_BGN, 
  formatCurrency 
}) => {
  const getCountryName = (code) => {
    switch (code) {
      case 'BG':
        return 'Bulgaria';
      default:
        return 'Unknown';
    }
  };

  const getExchangeRateText = () => {
    const { primary, exchangeRates } = countryConfig.currency;
    
    if (primary === 'BGN' && exchangeRates.EUR) {
      return `1 EUR = ${exchangeRates.EUR} BGN`;
    }
    
    // For other currencies, show against EUR if available
    if (exchangeRates.EUR) {
      return `1 ${primary} = ${(1 / exchangeRates.EUR).toFixed(4)} EUR`;
    }
    
    return null;
  };

  return (
    <div className="flex items-center gap-3 mb-6">
      <Calculator className="w-8 h-8 text-blue-600" />
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Salary Calculator</h1>
        <p className="text-sm text-gray-600">{getCountryName(selectedCountryCode)}</p>
      </div>
      <div className="ml-auto flex items-center gap-4">
        {getExchangeRateText() && (
          <div className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">{getExchangeRateText()}</span>
          </div>
        )}
        {isCeilingApplied && (
          <Badge variant="warning" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              Ceiling Applied: {formatCurrency(SOCIAL_SECURITY_CEILING_BGN, countryConfig.currency.primary)}
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
};