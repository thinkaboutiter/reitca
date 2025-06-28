export class SalaryCalculatorEngine {
  constructor(countryConfig) {
    this.config = countryConfig;
  }

  calculateSalary(grossSalary, hoursPerMonth = 160) {
    // Apply social security ceiling
    const socialSecurityBase = Math.min(
      grossSalary, 
      this.config.socialSecurityCeilings.monthly
    );

    // Calculate employee contributions
    const employeeContributions = this.calculateContributions(
      this.config.taxSystem.employeeContributions,
      grossSalary,
      socialSecurityBase
    );

    // Calculate employer contributions  
    const employerContributions = this.calculateContributions(
      this.config.taxSystem.employerContributions,
      grossSalary,
      socialSecurityBase
    );

    // Calculate taxable income and income tax
    const taxableIncome = grossSalary - employeeContributions.total;
    const incomeTax = this.calculateIncomeTax(taxableIncome);
    
    // Calculate final amounts
    const netSalary = taxableIncome - incomeTax;
    const totalCostToCompany = grossSalary + employerContributions.total;
    
    // Calculate totals and ratios
    const totalEmployeeDeductions = employeeContributions.total + incomeTax;
    const totalTaxesPaid = employeeContributions.total + employerContributions.total + incomeTax;
    const netToGrossRatio = (netSalary / grossSalary) * 100;
    const totalCostRatio = (totalCostToCompany / netSalary) * 100;

    // Check ceiling application
    const isCeilingApplied = grossSalary > this.config.socialSecurityCeilings.monthly;
    const socialSecuritySavings = isCeilingApplied ? 
      (grossSalary - this.config.socialSecurityCeilings.monthly) * 
      (this.getTotalContributionRate(this.config.taxSystem.employeeContributions, true) + 
       this.getTotalContributionRate(this.config.taxSystem.employerContributions, true)) : 0;

    // Hourly calculations
    const hourlyRates = {
      grossBgn: grossSalary / hoursPerMonth,
      grossEur: (grossSalary / hoursPerMonth) / this.config.exchangeRates.EUR,
      netBgn: netSalary / hoursPerMonth,
      netEur: (netSalary / hoursPerMonth) / this.config.exchangeRates.EUR,
      costBgn: totalCostToCompany / hoursPerMonth,
      costEur: (totalCostToCompany / hoursPerMonth) / this.config.exchangeRates.EUR
    };

    return {
      grossSalary,
      netSalary,
      taxableIncome,
      incomeTax,
      employeeContributions,
      employerContributions,
      totalCostToCompany,
      totalEmployeeDeductions,
      totalTaxesPaid,
      netToGrossRatio,
      totalCostRatio,
      isCeilingApplied,
      socialSecuritySavings,
      socialSecurityBase,
      hourlyRates
    };
  }

  calculateContributions(contributions, grossSalary, socialSecurityBase) {
    const result = { total: 0 };
    
    contributions.forEach(contribution => {
      const base = contribution.applyCeiling ? socialSecurityBase : grossSalary;
      const amount = base * contribution.rate;
      result[contribution.name] = amount;
      result.total += amount;
    });

    return result;
  }

  calculateIncomeTax(taxableIncome) {
    const { incomeTax } = this.config.taxSystem;
    
    if (incomeTax.type === 'flat') {
      return taxableIncome * incomeTax.rate;
    }
    
    // Add support for progressive tax systems in the future
    return 0;
  }

  getTotalContributionRate(contributions, onlyWithCeiling = false) {
    return contributions
      .filter(c => !onlyWithCeiling || c.applyCeiling)
      .reduce((total, c) => total + c.rate, 0);
  }
}