import React from 'react';
import { User, Building2 } from 'lucide-react';
import { Card } from '../shared/Card';

export const ContributionsBreakdown = ({
  employeeSocialSecurity,
  employerSocialSecurity,
  incomeTax,
  taxableIncome,
  totalEmployeeDeductions,
  totalCostToCompany,
  formatCurrency,
  currency
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Employee Contributions */}
      <Card>
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
                <span className="font-mono">{formatCurrency(employeeSocialSecurity.pension, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Insurance (3.2%)</span>
                <span className="font-mono">{formatCurrency(employeeSocialSecurity.health, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Unemployment (0.8%)</span>
                <span className="font-mono">{formatCurrency(employeeSocialSecurity.unemployment, currency)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Social Security</span>
                <span className="font-mono">{formatCurrency(employeeSocialSecurity.total, currency)}</span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Income Tax (10%)</span>
              <span className="font-mono text-lg">{formatCurrency(incomeTax, currency)}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Applied to: {formatCurrency(taxableIncome, currency)} (after social security)
            </div>
          </div>

          <div className="bg-red-100 p-4 rounded-lg border-2 border-red-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Employee Deductions</span>
              <span className="font-mono text-lg font-bold">{formatCurrency(totalEmployeeDeductions, currency)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Employer Contributions */}
      <Card>
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
                <span className="font-mono">{formatCurrency(employerSocialSecurity.pension, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Health Insurance (4.8%)</span>
                <span className="font-mono">{formatCurrency(employerSocialSecurity.health, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Unemployment (1.0%)</span>
                <span className="font-mono">{formatCurrency(employerSocialSecurity.unemployment, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Work Accidents (0.2%)</span>
                <span className="font-mono">{formatCurrency(employerSocialSecurity.workAccidents, currency)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total Employer Contributions</span>
                <span className="font-mono">{formatCurrency(employerSocialSecurity.total, currency)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded-lg border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">Total Cost to Company</span>
              <span className="font-mono text-lg font-bold">{formatCurrency(totalCostToCompany, currency)}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              Gross Salary + Employer Contributions
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};