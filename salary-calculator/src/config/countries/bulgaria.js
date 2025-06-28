export const bulgariaConfig = {
  code: 'BG',
  name: 'Bulgaria',
  currency: 'BGN',
  exchangeRates: {
    EUR: 1.95583
  },
  socialSecurityCeilings: {
    monthly: 4130, // BGN per month (2025)
    annual: 4130 * 12
  },
  taxSystem: {
    employeeContributions: [
      {
        name: 'pension',
        displayName: 'Pension Fund',
        rate: 0.0978,
        applyCeiling: true
      },
      {
        name: 'health',
        displayName: 'Health Insurance', 
        rate: 0.032,
        applyCeiling: true
      },
      {
        name: 'unemployment',
        displayName: 'Unemployment',
        rate: 0.008,
        applyCeiling: true
      }
    ],
    employerContributions: [
      {
        name: 'pension',
        displayName: 'Pension Fund',
        rate: 0.1292,
        applyCeiling: true
      },
      {
        name: 'health',
        displayName: 'Health Insurance',
        rate: 0.048,
        applyCeiling: true
      },
      {
        name: 'unemployment',
        displayName: 'Unemployment',
        rate: 0.01,
        applyCeiling: true
      },
      {
        name: 'workAccidents',
        displayName: 'Work Accidents',
        rate: 0.002,
        applyCeiling: false // Applied to full salary
      }
    ],
    incomeTax: {
      rate: 0.10,
      type: 'flat',
      taxableIncomeBase: 'gross_minus_social_security'
    }
  },
  metadata: {
    year: 2025,
    notes: [
      'All rates are current as of 2025 and may be subject to change',
      'Social security contributions are capped at monthly ceiling',
      'Income tax is applied to gross salary minus social security contributions',
      'Employer contributions are additional costs beyond the gross salary'
    ]
  }
};