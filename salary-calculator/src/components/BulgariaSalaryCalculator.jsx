import React, { useState } from 'react';
import { Calculator, User, Building2, Coins, TrendingUp, Clock, Euro } from 'lucide-react';

const BulgariaSalaryCalculator = () => {
  const [inputMode, setInputMode] = useState('monthly'); // 'monthly' or 'hourly'
  const [grossSalary, setGrossSalary] = useState(2000);
  const [hourlyRateEur, setHourlyRateEur] = useState(50);
  const [hoursPerMonth, setHoursPerMonth] = useState(160);
  const [currency, setCurrency] = useState('BGN'); // 'BGN' or 'EUR'

  // Fixed EUR/BGN exchange rate (Bulgaria's currency board rate)
  const EUR_TO_BGN_RATE = 1.95583;

  // Predefined hourly rates in EUR
  const predefinedRates = [
    200.00, 150.00, 120.00, 100.00, 95.00, 90.00, 85.00, 80.00, 75.00, 70.00,
    65.00, 60.00, 55.00, 50.00, 45.00, 40.00, 35.00, 30.00, 25.00
  ];

  // Calculate gross salary based on input mode
  const calculateGrossSalary = () => {
    if (inputMode === 'hourly') {
      const hourlyRateBgn = hourlyRateEur * EUR_TO_BGN_RATE;
      return hourlyRateBgn * hoursPerMonth;
    }
    return grossSalary;
  };

  const currentGrossSalary = calculateGrossSalary();
  const currentHourlyRateBgn = currentGrossSalary / hoursPerMonth;
  const currentHourlyRateEur = currentHourlyRateBgn / EUR_TO_BGN_RATE;

  // Employee contributions (from gross salary)
  const employeeSocialSecurity = {
    pension: currentGrossSalary * 0.0978,
    health: currentGrossSalary * 0.032,
    unemployment: currentGrossSalary * 0.008,
    total: currentGrossSalary * 0.1378
  };

  // Taxable income after social security
  const taxableIncome = currentGrossSalary - employeeSocialSecurity.total;
  const incomeTax = taxableIncome * 0.10;
  const netSalary = taxableIncome - incomeTax;

  // Employer contributions (additional to gross salary)
  const employerSocialSecurity = {
    pension: currentGrossSalary * 0.1292,
    health: currentGrossSalary * 0.048,
    unemployment: currentGrossSalary * 0.01,
    workAccidents: currentGrossSalary * 0.002,
    total: currentGrossSalary * 0.1892
  };

  // Total cost to company
  const totalCostToCompany = currentGrossSalary + employerSocialSecurity.total;

  // Summary calculations
  const totalEmployeeDeductions = employeeSocialSecurity.total + incomeTax;
  const totalTaxesPaid = employeeSocialSecurity.total + employerSocialSecurity.total + incomeTax;
  const netToGrossRatio = (netSalary / currentGrossSalary) * 100;
  const totalCostRatio = (totalCostToCompany / netSalary) * 100;

  // Hourly calculations
  const netHourlyRateBgn = netSalary / hoursPerMonth;
  const netHourlyRateEur = netHourlyRateBgn / EUR_TO_BGN_RATE;
  const costPerHourBgn = totalCostToCompany / hoursPerMonth;
  const costPerHourEur = costPerHourBgn / EUR_TO_BGN_RATE;

  const formatCurrency = (amount, curr = currency) => {
    if (curr === 'EUR') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
      }).format(amount / EUR_TO_BGN_RATE);
    }
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const displayAmount = (amount) => {
    return currency === 'EUR' ? amount / EUR_TO_BGN_RATE : amount;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Calculator className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Bulgaria Salary Calculator</h1>
          <div className="ml-auto flex items-center gap-2">
            <Euro className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600">1 EUR = {EUR_TO_BGN_RATE} BGN</span>
          </div>
        </div>
        
        {/* Input Mode Toggle */}
        <div className="mb-6">
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
      </div>

      {/* Rate Comparison */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Employee Contributions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-bold text-gray-800">Employee Pays</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Social Security Contributions (13.78%)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pension Fund (9.78%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employeeSocialSecurity.pension))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Insurance (3.2%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employeeSocialSecurity.health))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unemployment (0.8%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employeeSocialSecurity.unemployment))}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Social Security</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employeeSocialSecurity.total))}</span>
                </div>
              </div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Income Tax (10%)</span>
                <span className="font-mono text-lg">{formatCurrency(displayAmount(incomeTax))}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Applied to: {formatCurrency(displayAmount(taxableIncome))} (after social security)
              </div>
            </div>

            <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Employee Deductions</span>
                <span className="font-mono text-lg font-bold">{formatCurrency(displayAmount(totalEmployeeDeductions))}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Employer Contributions */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Building2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Company Pays</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Employer Social Security (18.92%)</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Pension Fund (12.92%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employerSocialSecurity.pension))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Health Insurance (4.8%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employerSocialSecurity.health))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unemployment (1.0%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employerSocialSecurity.unemployment))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Work Accidents (0.2%)</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employerSocialSecurity.workAccidents))}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total Employer Contributions</span>
                  <span className="font-mono">{formatCurrency(displayAmount(employerSocialSecurity.total))}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total Cost to Company</span>
                <span className="font-mono text-lg font-bold">{formatCurrency(displayAmount(totalCostToCompany))}</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Gross Salary + Employer Contributions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-gray-700">Net Salary</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(displayAmount(netSalary))}</div>
          {currency === 'EUR' && (
            <div className="text-sm text-gray-500">{formatCurrency(netSalary, 'BGN')}</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-orange-600" />
            <span className="font-semibold text-gray-700">Total Taxes</span>
          </div>
          <div className="text-2xl font-bold text-orange-600">{formatCurrency(displayAmount(totalTaxesPaid))}</div>
          {currency === 'EUR' && (
            <div className="text-sm text-gray-500">{formatCurrency(totalTaxesPaid, 'BGN')}</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <span className="font-semibold text-gray-700 block mb-2">Net/Gross Ratio</span>
          <div className="text-2xl font-bold text-purple-600">{netToGrossRatio.toFixed(1)}%</div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4">
          <span className="font-semibold text-gray-700 block mb-2">Cost/Net Ratio</span>
          <div className="text-2xl font-bold text-indigo-600">{totalCostRatio.toFixed(1)}%</div>
        </div>
      </div>

      {/* Breakdown Table */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Complete Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Description</th>
                <th className="text-right py-3 px-4 font-semibold">Rate</th>
                <th className="text-right py-3 px-4 font-semibold">Amount ({currency})</th>
                <th className="text-right py-3 px-4 font-semibold">Who Pays</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="bg-green-50">
                <td className="py-3 px-4 font-semibold">Gross Salary</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(displayAmount(currentGrossSalary))}</td>
                <td className="py-3 px-4 text-right">Base</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Employee Pension Fund</td>
                <td className="py-3 px-4 text-right">9.78%</td>
                <td className="py-3 px-4 text-right font-mono">-{formatCurrency(displayAmount(employeeSocialSecurity.pension))}</td>
                <td className="py-3 px-4 text-right text-red-600">Employee</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Employee Health Insurance</td>
                <td className="py-3 px-4 text-right">3.20%</td>
                <td className="py-3 px-4 text-right font-mono">-{formatCurrency(displayAmount(employeeSocialSecurity.health))}</td>
                <td className="py-3 px-4 text-right text-red-600">Employee</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Employee Unemployment</td>
                <td className="py-3 px-4 text-right">0.80%</td>
                <td className="py-3 px-4 text-right font-mono">-{formatCurrency(displayAmount(employeeSocialSecurity.unemployment))}</td>
                <td className="py-3 px-4 text-right text-red-600">Employee</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Income Tax</td>
                <td className="py-3 px-4 text-right">10.00%</td>
                <td className="py-3 px-4 text-right font-mono">-{formatCurrency(displayAmount(incomeTax))}</td>
                <td className="py-3 px-4 text-right text-red-600">Employee</td>
              </tr>
              <tr className="bg-green-100 font-semibold">
                <td className="py-3 px-4">Net Salary</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(displayAmount(netSalary))}</td>
                <td className="py-3 px-4 text-right">Employee Gets</td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td className="py-3 px-4">Employer Pension Fund</td>
                <td className="py-3 px-4 text-right">12.92%</td>
                <td className="py-3 px-4 text-right font-mono">+{formatCurrency(displayAmount(employerSocialSecurity.pension))}</td>
                <td className="py-3 px-4 text-right text-blue-600">Company</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Employer Health Insurance</td>
                <td className="py-3 px-4 text-right">4.80%</td>
                <td className="py-3 px-4 text-right font-mono">+{formatCurrency(displayAmount(employerSocialSecurity.health))}</td>
                <td className="py-3 px-4 text-right text-blue-600">Company</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Employer Unemployment</td>
                <td className="py-3 px-4 text-right">1.00%</td>
                <td className="py-3 px-4 text-right font-mono">+{formatCurrency(displayAmount(employerSocialSecurity.unemployment))}</td>
                <td className="py-3 px-4 text-right text-blue-600">Company</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Work Accidents Insurance</td>
                <td className="py-3 px-4 text-right">0.20%</td>
                <td className="py-3 px-4 text-right font-mono">+{formatCurrency(displayAmount(employerSocialSecurity.workAccidents))}</td>
                <td className="py-3 px-4 text-right text-blue-600">Company</td>
              </tr>
              <tr className="bg-blue-100 font-semibold">
                <td className="py-3 px-4">Total Cost to Company</td>
                <td className="py-3 px-4 text-right">-</td>
                <td className="py-3 px-4 text-right font-mono">{formatCurrency(displayAmount(totalCostToCompany))}</td>
                <td className="py-3 px-4 text-right">Company Pays</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-2">Key Points:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• All rates are current as of 2025 and may be subject to change</li>
          <li>• Exchange rate used: 1 EUR = {EUR_TO_BGN_RATE} BGN (official currency board rate)</li>
          <li>• Standard working month: {hoursPerMonth} hours (can be adjusted)</li>
          <li>• Income tax is applied to gross salary minus social security contributions</li>
          <li>• Employer contributions are additional costs beyond the gross salary</li>
        </ul>
      </div>
    </div>
  );
};

export default BulgariaSalaryCalculator;