import { useState, useMemo } from 'react';
import { 
  getCountryConfig, 
  convertCurrency, 
  calculateSocialSecurityBase,
  isSocialSecurityCeilingApplied,
  calculateSocialSecuritySavings
} from '../../../config/countries';

export const useSalaryCalculation = (countryCode = 'BG') => {
  // Get country configuration
  const countryConfig = getCountryConfig(countryCode);
  
  // State - using country defaults
  const [inputMode, setInputMode] = useState('monthly');
  const [grossSalary, setGrossSalary] = useState(countryConfig.defaults.grossSalary);
  const [hourlyRateEur, setHourlyRateEur] = useState(countryConfig.defaults.hourlyRateEur);
  const [hoursPerMonth, setHoursPerMonth] = useState(countryConfig.defaults.hoursPerMonth);
  const [currency, setCurrency] = useState(countryConfig.currency.primary);

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
        const exchangeRate = countryConfig.currency.exchangeRates.EUR;
        const hourlyRateInPrimaryCurrency = hourlyRateEur * exchangeRate;
        return hourlyRateInPrimaryCurrency * hoursPerMonth;
      }
      return grossSalary;
    };

    const currentGrossSalary = calculateGrossSalary();
    const currentHourlyRateBgn = currentGrossSalary / hoursPerMonth;
    
    // Apply social security ceiling using helper function
    const socialSecurityBase = calculateSocialSecurityBase(currentGrossSalary, countryConfig);

    // Employee contributions (from gross salary, up to ceiling)
    const { employeeSocialSecurity: empRates } = countryConfig;
    const employeeSocialSecurity = {
      pension: socialSecurityBase * empRates.pension,
      health: socialSecurityBase * empRates.health,
      unemployment: socialSecurityBase * empRates.unemployment,
      total: socialSecurityBase * empRates.total
    };

    // Taxable income after social security
    const taxableIncome = currentGrossSalary - employeeSocialSecurity.total;
    const incomeTax = taxableIncome * countryConfig.incomeTax.rate;
    const netSalary = taxableIncome - incomeTax;

    // Employer contributions (additional to gross salary, social security up to ceiling)
    const { employerSocialSecurity: empRRates } = countryConfig;
    const employerSocialSecurity = {
      pension: socialSecurityBase * empRRates.pension,
      health: socialSecurityBase * empRRates.health,
      unemployment: socialSecurityBase * empRRates.unemployment,
      workAccidents: currentGrossSalary * empRRates.workAccidents, // Work accidents apply to full salary
      total: (socialSecurityBase * (empRRates.pension + empRRates.health + empRRates.unemployment)) + 
             (currentGrossSalary * empRRates.workAccidents)
    };

    // Total cost to company
    const totalCostToCompany = currentGrossSalary + employerSocialSecurity.total;

    // Summary calculations
    const totalEmployeeDeductions = employeeSocialSecurity.total + incomeTax;
    const totalTaxesPaid = employeeSocialSecurity.total + employerSocialSecurity.total + incomeTax;
    const netToGrossRatio = (netSalary / currentGrossSalary) * 100;
    const totalCostRatio = (totalCostToCompany / netSalary) * 100;

    // Check if ceiling is applied using helper function
    const isCeilingApplied = isSocialSecurityCeilingApplied(currentGrossSalary, countryConfig);
    const socialSecuritySavings = calculateSocialSecuritySavings(currentGrossSalary, countryConfig);

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
  }, [inputMode, grossSalary, hourlyRateEur, hoursPerMonth, countryConfig]);

  // Currency formatting function using country config
  const formatCurrency = (amount, curr = currency) => {
    const { primary, exchangeRates } = countryConfig.currency;
    const { locale, currencyDecimals } = countryConfig.formatting;
    
    if (curr !== primary && exchangeRates[curr]) {
      // Convert to foreign currency
      const convertedAmount = convertCurrency(amount, primary, curr, countryConfig);
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: curr,
        minimumFractionDigits: currencyDecimals
      }).format(convertedAmount);
    }
    
    // Display in primary currency
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: primary,
      minimumFractionDigits: currencyDecimals
    }).format(amount);
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

    // Country configuration and constants
    countryConfig,
    EUR_TO_BGN_RATE: countryConfig.currency.exchangeRates.EUR,
    SOCIAL_SECURITY_CEILING_BGN: countryConfig.socialSecurity.ceiling.monthly,
    predefinedRates,

    // Calculations
    ...calculations,

    // Utilities
    formatCurrency
  };
};