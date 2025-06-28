/**
 * Country-specific tax and salary calculation configurations
 * This file centralizes all tax rates, social security rates, and other
 * country-specific constants to support multi-country salary calculations.
 */

export const COUNTRIES = {
  BULGARIA: {
    code: 'BG',
    name: 'Bulgaria',
    currency: {
      primary: 'BGN',
      symbol: 'лв.',
      exchangeRates: {
        EUR: 1.95583 // Fixed rate due to currency board arrangement
      }
    },
    
    // Employee social security contributions (as percentages)
    employeeSocialSecurity: {
      pension: 0.0978,        // 9.78%
      health: 0.032,          // 3.2%
      unemployment: 0.008,    // 0.8%
      total: 0.1378          // 13.78% total
    },
    
    // Employer social security contributions (as percentages)
    employerSocialSecurity: {
      pension: 0.1292,        // 12.92%
      health: 0.048,          // 4.8%
      unemployment: 0.01,     // 1.0%
      workAccidents: 0.002,   // 0.2%
      total: 0.1892          // 18.92% total
    },
    
    // Income tax configuration
    incomeTax: {
      rate: 0.10,            // 10% flat tax rate
      // Bulgaria uses flat tax, but structure allows for progressive rates
      brackets: [
        { min: 0, max: Infinity, rate: 0.10 }
      ]
    },
    
    // Social security ceiling (maximum amount for contributions)
    socialSecurity: {
      ceiling: {
        monthly: 4130,        // BGN per month (2025 rate)
        annual: 4130 * 12     // BGN per year
      },
      // Which contributions are subject to ceiling
      ceilingAppliesTo: {
        employee: {
          pension: true,
          health: true,
          unemployment: true
        },
        employer: {
          pension: true,
          health: true,
          unemployment: true,
          workAccidents: false  // Applied to full salary
        }
      }
    },
    
    // Default calculation parameters
    defaults: {
      grossSalary: 2000,      // BGN
      hourlyRateEur: 50,      // EUR
      // Working time calculations based on Bulgarian labor law:
      // Standard: 22 working days × 8 hours = 176 hours per month
      hoursPerMonth: 176,     // Bulgarian legal standard (22 days × 8 hours)
      workingDaysPerMonth: 22, // Standard working days per month in Bulgaria
      workingHoursPerDay: 8   // Standard full-time daily hours
    },
    
    // Working hours calculation methods available to users
    workingHoursMethods: {
      legal: {
        name: 'Legal Standard (Bulgaria)',
        description: '22 working days × 8 hours',
        hours: 176,
        days: 22,
        hoursPerDay: 8
      },
      simplified: {
        name: 'Simplified (4 weeks)',
        description: '4 weeks × 5 days × 8 hours',
        hours: 160,
        days: 20,
        hoursPerDay: 8
      },
      weekly: {
        name: 'Weekly Average',
        description: '40 hours/week × 4.33 weeks',
        hours: Math.round(40 * (52 / 12)), // ≈ 173 hours
        days: Math.round(5 * (52 / 12)), // ≈ 22 days
        hoursPerDay: 8
      }
    },
    
    // Minimum wage and other legal requirements
    legal: {
      minimumWage: {
        monthly: 933,         // BGN (2025 rate)
        hourly: 933 / 176     // Calculated using Bulgarian legal standard (176 hours)
      }
    },
    
    // Display formatting
    formatting: {
      currencyDecimals: 2,
      percentageDecimals: 1,
      locale: 'bg-BG'
    }
  }
};

// Helper functions for accessing country data
export const getCountryConfig = (countryCode = 'BG') => {
  const country = Object.values(COUNTRIES).find(c => c.code === countryCode);
  if (!country) {
    throw new Error(`Country configuration not found for code: ${countryCode}`);
  }
  return country;
};

export const getSupportedCountries = () => {
  return Object.values(COUNTRIES).map(country => ({
    code: country.code,
    name: country.name,
    currency: country.currency.primary
  }));
};

// Currency conversion helpers
export const convertCurrency = (amount, fromCurrency, toCurrency, countryConfig) => {
  if (fromCurrency === toCurrency) {
    return amount;
  }
  
  const { primary, exchangeRates } = countryConfig.currency;
  
  // Convert from primary currency to target currency
  if (fromCurrency === primary && exchangeRates[toCurrency]) {
    return amount / exchangeRates[toCurrency];
  }
  
  // Convert from foreign currency to primary currency
  if (toCurrency === primary && exchangeRates[fromCurrency]) {
    return amount * exchangeRates[fromCurrency];
  }
  
  throw new Error(`Currency conversion not supported: ${fromCurrency} to ${toCurrency}`);
};

// Tax calculation helpers
export const calculateSocialSecurityBase = (grossSalary, countryConfig) => {
  const ceiling = countryConfig.socialSecurity.ceiling.monthly;
  return Math.min(grossSalary, ceiling);
};

export const isSocialSecurityCeilingApplied = (grossSalary, countryConfig) => {
  return grossSalary > countryConfig.socialSecurity.ceiling.monthly;
};

export const calculateSocialSecuritySavings = (grossSalary, countryConfig) => {
  const ceiling = countryConfig.socialSecurity.ceiling.monthly;
  if (grossSalary <= ceiling) {
    return 0;
  }
  
  const excessAmount = grossSalary - ceiling;
  const { employeeSocialSecurity, employerSocialSecurity } = countryConfig;
  
  return excessAmount * (employeeSocialSecurity.total + employerSocialSecurity.total);
};

// Working hours calculation helpers
export const calculateMonthlyHours = (countryConfig, method = 'legal') => {
  if (!countryConfig.workingHoursMethods[method]) {
    return countryConfig.defaults.hoursPerMonth;
  }
  
  return countryConfig.workingHoursMethods[method].hours;
};

// Default country (can be changed based on user preference or detection)
export const DEFAULT_COUNTRY = COUNTRIES.BULGARIA;