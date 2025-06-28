import React from 'react';
import { Coins, TrendingUp } from 'lucide-react';
import { Card } from '../shared/Card';

export const SummaryCards = ({
  netSalary,
  totalTaxesPaid,
  netToGrossRatio,
  totalCostRatio,
  currency,
  formatCurrency,
  displayAmount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card padding="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Coins className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-gray-700">Net Salary</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{formatCurrency(displayAmount(netSalary))}</div>
        {currency === 'EUR' && (
          <div className="text-sm text-gray-500">{formatCurrency(netSalary, 'BGN')}</div>
        )}
      </Card>

      <Card padding="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-orange-600" />
          <span className="font-semibold text-gray-700">Total Taxes</span>
        </div>
        <div className="text-2xl font-bold text-orange-600">{formatCurrency(displayAmount(totalTaxesPaid))}</div>
        {currency === 'EUR' && (
          <div className="text-sm text-gray-500">{formatCurrency(totalTaxesPaid, 'BGN')}</div>
        )}
      </Card>

      <Card padding="p-4">
        <span className="font-semibold text-gray-700 block mb-2">Net/Gross Ratio</span>
        <div className="text-2xl font-bold text-purple-600">{netToGrossRatio.toFixed(1)}%</div>
      </Card>

      <Card padding="p-4">
        <span className="font-semibold text-gray-700 block mb-2">Cost/Net Ratio</span>
        <div className="text-2xl font-bold text-indigo-600">{totalCostRatio.toFixed(1)}%</div>
      </Card>
    </div>
  );
};