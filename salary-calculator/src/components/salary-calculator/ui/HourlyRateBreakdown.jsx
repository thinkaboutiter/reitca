import React from 'react';
import { Clock } from 'lucide-react';
import { Card } from '../shared/Card';

export const HourlyRateBreakdown = ({
  currentHourlyRateBgn,
  netHourlyRateBgn,
  costPerHourBgn,
  netToGrossRatio,
  EUR_TO_BGN_RATE,
  formatCurrency
}) => {
  return (
    <Card className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Hourly Rate Breakdown
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Gross Rate</div>
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(currentHourlyRateBgn * EUR_TO_BGN_RATE, 'EUR')}/h
          </div>
          <div className="text-sm text-gray-500">
            {formatCurrency(currentHourlyRateBgn, 'BGN')}/h
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Net Rate</div>
          <div className="text-lg font-bold text-green-600">
            {formatCurrency(netHourlyRateBgn * EUR_TO_BGN_RATE, 'EUR')}/h
          </div>
          <div className="text-sm text-gray-500">
            {formatCurrency(netHourlyRateBgn, 'BGN')}/h
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Cost to Company</div>
          <div className="text-lg font-bold text-red-600">
            {formatCurrency(costPerHourBgn * EUR_TO_BGN_RATE, 'EUR')}/h
          </div>
          <div className="text-sm text-gray-500">
            {formatCurrency(costPerHourBgn, 'BGN')}/h
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600">Efficiency</div>
          <div className="text-lg font-bold text-purple-600">{netToGrossRatio.toFixed(1)}%</div>
          <div className="text-sm text-gray-500">Net/Gross</div>
        </div>
      </div>
    </Card>
  );
};