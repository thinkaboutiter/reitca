import React from 'react';

export const InputControls = ({
  inputMode,
  setInputMode,
  currency,
  setCurrency,
  grossSalary,
  setGrossSalary,
  hourlyRateEur,
  setHourlyRateEur,
  hoursPerMonth,
  setHoursPerMonth,
  currentGrossSalary,
  formatCurrency,
  predefinedRates
}) => {
  return (
    <div className="mb-6">
      {/* Input Mode Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 max-w-md">
        <button
          onClick={() => setInputMode('monthly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            inputMode === 'monthly' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Monthly Salary
        </button>
        <button
          onClick={() => setInputMode('hourly')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            inputMode === 'hourly' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Hourly Rate
        </button>
      </div>

      {/* Currency Toggle */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 max-w-xs">
        <button
          onClick={() => setCurrency('BGN')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            currency === 'BGN' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          BGN
        </button>
        <button
          onClick={() => setCurrency('EUR')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            currency === 'EUR' 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          EUR
        </button>
      </div>

      {/* Input Fields */}
      {inputMode === 'monthly' ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gross Monthly Salary (BGN)
          </label>
          <input
            type="number"
            value={grossSalary}
            onChange={(e) => setGrossSalary(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            min="0"
            step="100"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hourly Rate (EUR)
            </label>
            <input
              type="number"
              value={hourlyRateEur}
              onChange={(e) => setHourlyRateEur(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="0"
              step="5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours per Month
            </label>
            <input
              type="number"
              value={hoursPerMonth}
              onChange={(e) => setHoursPerMonth(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              min="1"
              step="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Gross (BGN)
            </label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-lg font-mono">
              {formatCurrency(currentGrossSalary, 'BGN')}
            </div>
          </div>
        </div>
      )}

      {/* Predefined Rates */}
      {inputMode === 'hourly' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Select (EUR/hour):
          </label>
          <div className="flex flex-wrap gap-2">
            {predefinedRates.map((rate) => (
              <button
                key={rate}
                onClick={() => setHourlyRateEur(rate)}
                className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
                  hourlyRateEur === rate
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                €{rate}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};