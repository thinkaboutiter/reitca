import React from 'react';
import { Clock, Info } from 'lucide-react';
import { Card } from '../shared/Card';

export const WorkingHoursSelector = ({
  selectedMethod = 'legal',
  onMethodChange,
  workingHoursMethods,
  currentHours
}) => {
  return (
    <Card className="mb-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Working Hours Calculation Method
      </h3>
      
      <div className="mb-4">
        <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Choose how monthly working hours are calculated</p>
            <p>This affects hourly rate calculations and salary conversions. The legal standard reflects Bulgarian labor law.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(workingHoursMethods).map(([key, method]) => (
          <label
            key={key}
            className={`
              flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selectedMethod === key 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name="workingHoursMethod"
              value={key}
              checked={selectedMethod === key}
              onChange={(e) => onMethodChange(e.target.value)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-900">{method.name}</span>
                <span className={`
                  px-2 py-1 text-sm font-medium rounded
                  ${key === 'legal' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-700'
                  }
                `}>
                  {method.hours} hrs/month
                </span>
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
              <div className="mt-2 text-xs text-gray-500">
                {method.days} working days × {method.hoursPerDay} hours/day = {method.hours} hours/month
              </div>
            </div>
          </label>
        ))}
      </div>

      {/* Current selection summary */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Currently using:</span>
          <span className="font-medium text-gray-900">
            {currentHours} hours per month
          </span>
        </div>
      </div>
    </Card>
  );
};