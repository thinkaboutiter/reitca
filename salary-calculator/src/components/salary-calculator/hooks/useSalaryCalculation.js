import { useState, useMemo } from 'react';

export const useSalaryCalculation = () => {
  // State
  const [inputMode, setInputMode] = useState('monthly');
  const [grossSalary, setGrossSalary] = useState(2000);
  const [hourlyRateEur, setHourlyRateEur] = useState(50);
  const [hoursPerMonth, setHoursPerMonth] = useState(160);
  const [currency, setCurrency] = useState('BGN');

  // Constants
  const EUR_TO_BGN_RATE = 1.95583;
  const SOCIAL_SECURITY_CEILING_BGN = 4130;

  // Predefined hourly rates in EUR
  const predefinedRates = [
    200.00, 150.00, 120.00, 100.00, 95.00, 90.00, 85.00, 80.00, 75.00, 70.00,
    65.00, 60.00, 55.00, 50.00, 45.00, 40.00, 35.00, 30.00, 25.00
  ];

  // Memoized calculations
  const calculations = useMemo(() => {
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
    
    // Apply social security ceiling
    const socialSecurityBase = Math.min(currentGrossSalary, SOCIAL_SECURITY_CEILING_BGN);

    // Employee contributions (from gross salary, up to ceiling)
    const employeeSocialSecurity = {
      pension: socialSecurityBase * 0.0978,
      health: socialSecurityBase * 0.032,
      unemployment: socialSecurityBase * 0.008,
      total: socialSecurityBase * 0.1378
    };

    // Taxable income after social security
    const taxableIncome = currentGrossSalary - employeeSocialSecurity.total;
    const incomeTax = taxableIncome * 0.10;
    const netSalary = taxableIncome - incomeTax;

    // Employer contributions (additional to gross salary, social security up to ceiling)
    const employerSocialSecurity = {
      pension: socialSecurityBase * 0.1292,
      health: socialSecurityBase * 0.048,
      unemployment: socialSecurityBase * 0.01,
      workAccidents: currentGrossSalary * 0.002, // Work accidents apply to full salary
      total: socialSecurityBase * 0.1892 + (currentGrossSalary - socialSecurityBase) * 0.002
    };

    // Total cost to company
    const totalCostToCompany = currentGrossSalary + employerSocialSecurity.total;

    // Summary calculations
    const totalEmployeeDeductions = employeeSocialSecurity.total + incomeTax;
    const totalTaxesPaid = employeeSocialSecurity.total + employerSocialSecurity.total + incomeTax;
    const netToGrossRatio = (netSalary / currentGrossSalary) * 100;
    const totalCostRatio = (totalCostToCompany / netSalary) * 100;

    // Check if ceiling is applied
    const isCeilingApplied = currentGrossSalary > SOCIAL_SECURITY_CEILING_BGN;
    const socialSecuritySavings = isCeilingApplied ? 
      (currentGrossSalary - SOCIAL_SECURITY_CEILING_BGN) * (0.1378 + 0.1892) : 0;

    // Hourly calculations
    const netHourlyRateBgn = netSalary / hoursPerMonth;
    const costPerHourBgn = totalCostToCompany / hoursPerMonth;

    return {
      currentGrossSalary,
      currentHourlyRateBgn,
      socialSecurityBase,
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
      costPerHourBgn
    };
  }, [inputMode, grossSalary, hourlyRateEur, hoursPerMonth]);

  // Currency formatting function
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

  return {
    // State
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
    ...calculations,

    // Utilities
    formatCurrency,
    displayAmount
  };
};