import React from 'react';

export const KeyPoints = ({
  EUR_TO_BGN_RATE,
  hoursPerMonth,
  SOCIAL_SECURITY_CEILING_BGN,
  isCeilingApplied,
  socialSecuritySavings,
  formatCurrency,
  currency
}) => {
  return (
    <div className="mt-6 bg-gray-50 rounded-lg p-4">
      <h4 className="font-semibold text-gray-800 mb-2">Key Points:</h4>
      <ul className="text-sm text-gray-600 space-y-1">
        <li>• All rates are current as of 2025 and may be subject to change</li>
        <li>• Exchange rate used: 1 EUR = {EUR_TO_BGN_RATE} BGN (official currency board rate)</li>
        <li>• Standard working month: {hoursPerMonth} hours (can be adjusted)</li>
        <li>• Income tax is applied to gross salary minus social security contributions</li>
        <li>• Employer contributions are additional costs beyond the gross salary</li>
        <li>• Social security contributions are capped at {formatCurrency(SOCIAL_SECURITY_CEILING_BGN, 'BGN')} per month</li>
        {isCeilingApplied && (
          <li className="text-orange-700 font-medium">
            • Monthly savings from ceiling: {formatCurrency(socialSecuritySavings, currency)} 
            (employee + employer combined)
          </li>
        )}
      </ul>
    </div>
  );
};