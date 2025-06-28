import React from 'react';
import { Calculator, Euro, TrendingUp } from 'lucide-react';
import { Badge } from '../shared/Badge';

export const Header = ({ 
  EUR_TO_BGN_RATE, 
  isCeilingApplied, 
  SOCIAL_SECURITY_CEILING_BGN, 
  formatCurrency 
}) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Calculator className="w-8 h-8 text-blue-600" />
      <h1 className="text-3xl font-bold text-gray-800">Bulgaria Salary Calculator</h1>
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Euro className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-600">1 EUR = {EUR_TO_BGN_RATE} BGN</span>
        </div>
        {isCeilingApplied && (
          <Badge variant="warning" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="font-medium">
              Ceiling Applied: {formatCurrency(SOCIAL_SECURITY_CEILING_BGN, 'BGN')}
            </span>
          </Badge>
        )}
      </div>
    </div>
  );
};