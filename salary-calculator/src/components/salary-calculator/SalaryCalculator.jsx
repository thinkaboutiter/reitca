import React from 'react';
import { useSalaryCalculation } from './hooks/useSalaryCalculation';
import { Header } from './ui/Header';
import { InputControls } from './ui/InputControls';
import { HourlyRateBreakdown } from './ui/HourlyRateBreakdown';
import { ContributionsBreakdown } from './ui/ContributionsBreakdown';
import { SummaryCards } from './ui/SummaryCards';
import { DetailedTable } from './ui/DetailedTable';
import { KeyPoints } from './ui/KeyPoints';
import { Card } from './shared/Card';

const SalaryCalculator = () => {
  const {
    // State and setters
    inputMode,
    setInputMode,
    grossSalary,
    setGrossSalary,
    hourlyRateEur,
    setHourlyRateEur,
    hoursPerMonth,
    setHoursPerMonth,
    currency,
    setCurrency,

    // Constants
    EUR_TO_BGN_RATE,
    SOCIAL_SECURITY_CEILING_BGN,
    predefinedRates,

    // Calculations
    currentGrossSalary,
    currentHourlyRateBgn,
    employeeSocialSecurity,
    taxableIncome,
    incomeTax,
    netSalary,
    employerSocialSecurity,
    totalCostToCompany,
    totalEmployeeDeductions,
    totalTaxesPaid,
    netToGrossRatio,
    totalCostRatio,
    isCeilingApplied,
    socialSecuritySavings,
    netHourlyRateBgn,
    costPerHourBgn,

    // Utilities
    formatCurrency
  } = useSalaryCalculation();

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-green-50 min-h-screen">
      <Card className="mb-6">
        <Header 
          EUR_TO_BGN_RATE={EUR_TO_BGN_RATE}
          isCeilingApplied={isCeilingApplied}
          SOCIAL_SECURITY_CEILING_BGN={SOCIAL_SECURITY_CEILING_BGN}
          formatCurrency={formatCurrency}
        />
        
        <InputControls
          inputMode={inputMode}
          setInputMode={setInputMode}
          currency={currency}
          setCurrency={setCurrency}
          grossSalary={grossSalary}
          setGrossSalary={setGrossSalary}
          hourlyRateEur={hourlyRateEur}
          setHourlyRateEur={setHourlyRateEur}
          hoursPerMonth={hoursPerMonth}
          setHoursPerMonth={setHoursPerMonth}
          currentGrossSalary={currentGrossSalary}
          formatCurrency={formatCurrency}
          predefinedRates={predefinedRates}
        />
      </Card>

      <HourlyRateBreakdown
        currentHourlyRateBgn={currentHourlyRateBgn}
        netHourlyRateBgn={netHourlyRateBgn}
        costPerHourBgn={costPerHourBgn}
        netToGrossRatio={netToGrossRatio}
        EUR_TO_BGN_RATE={EUR_TO_BGN_RATE}
        formatCurrency={formatCurrency}
      />

      <ContributionsBreakdown
        employeeSocialSecurity={employeeSocialSecurity}
        employerSocialSecurity={employerSocialSecurity}
        incomeTax={incomeTax}
        taxableIncome={taxableIncome}
        totalEmployeeDeductions={totalEmployeeDeductions}
        totalCostToCompany={totalCostToCompany}
        formatCurrency={formatCurrency}
        currency={currency}
      />

      <SummaryCards
        netSalary={netSalary}
        totalTaxesPaid={totalTaxesPaid}
        netToGrossRatio={netToGrossRatio}
        totalCostRatio={totalCostRatio}
        currency={currency}
        formatCurrency={formatCurrency}
      />

      <DetailedTable
        currentGrossSalary={currentGrossSalary}
        employeeSocialSecurity={employeeSocialSecurity}
        incomeTax={incomeTax}
        netSalary={netSalary}
        employerSocialSecurity={employerSocialSecurity}
        totalCostToCompany={totalCostToCompany}
        isCeilingApplied={isCeilingApplied}
        SOCIAL_SECURITY_CEILING_BGN={SOCIAL_SECURITY_CEILING_BGN}
        currency={currency}
        formatCurrency={formatCurrency}
      />

      <KeyPoints
        EUR_TO_BGN_RATE={EUR_TO_BGN_RATE}
        hoursPerMonth={hoursPerMonth}
        SOCIAL_SECURITY_CEILING_BGN={SOCIAL_SECURITY_CEILING_BGN}
        isCeilingApplied={isCeilingApplied}
        socialSecuritySavings={socialSecuritySavings}
        formatCurrency={formatCurrency}
        currency={currency}
      />
    </div>
  );
};

export default SalaryCalculator;