import { renderHook, act } from '@testing-library/react';
import { useSalaryCalculation } from '../../components/salary-calculator/hooks/useSalaryCalculation';

describe('useSalaryCalculation', () => {
  const EUR_TO_BGN_RATE = 1.95583;
  const SOCIAL_SECURITY_CEILING_BGN = 4130;

  describe('Initial state', () => {
    test('should have correct default values', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      expect(result.current.inputMode).toBe('monthly');
      expect(result.current.grossSalary).toBe(2000);
      expect(result.current.hourlyRateEur).toBe(50);
      expect(result.current.hoursPerMonth).toBe(160);
      expect(result.current.currency).toBe('BGN');
      expect(result.current.EUR_TO_BGN_RATE).toBe(EUR_TO_BGN_RATE);
      expect(result.current.SOCIAL_SECURITY_CEILING_BGN).toBe(SOCIAL_SECURITY_CEILING_BGN);
    });
  });

  describe('Monthly salary mode calculations', () => {
    test('should calculate correctly for monthly salary input', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // Test with 2000 BGN monthly salary (default)
      expect(result.current.currentGrossSalary).toBe(2000);
      expect(result.current.currentHourlyRateBgn).toBe(2000 / 160); // 12.5 BGN/h
      
      // Employee social security contributions (13.78% total)
      expect(result.current.employeeSocialSecurity.pension).toBeCloseTo(2000 * 0.0978); // 195.6
      expect(result.current.employeeSocialSecurity.health).toBeCloseTo(2000 * 0.032); // 64
      expect(result.current.employeeSocialSecurity.unemployment).toBeCloseTo(2000 * 0.008); // 16
      expect(result.current.employeeSocialSecurity.total).toBeCloseTo(2000 * 0.1378); // 275.6

      // Income tax (10% on taxable income)
      const expectedTaxableIncome = 2000 - (2000 * 0.1378);
      expect(result.current.taxableIncome).toBeCloseTo(expectedTaxableIncome);
      expect(result.current.incomeTax).toBeCloseTo(expectedTaxableIncome * 0.10);

      // Net salary
      const expectedNetSalary = expectedTaxableIncome - (expectedTaxableIncome * 0.10);
      expect(result.current.netSalary).toBeCloseTo(expectedNetSalary);

      // Employer contributions (18.92% total)
      expect(result.current.employerSocialSecurity.pension).toBeCloseTo(2000 * 0.1292);
      expect(result.current.employerSocialSecurity.health).toBeCloseTo(2000 * 0.048);
      expect(result.current.employerSocialSecurity.unemployment).toBeCloseTo(2000 * 0.01);
      expect(result.current.employerSocialSecurity.workAccidents).toBeCloseTo(2000 * 0.002);
      expect(result.current.employerSocialSecurity.total).toBeCloseTo(2000 * 0.1892);

      // Total cost to company
      expect(result.current.totalCostToCompany).toBeCloseTo(2000 + (2000 * 0.1892));
    });

    test('should not apply ceiling for salary below limit', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // 2000 BGN is below the 4130 BGN ceiling
      expect(result.current.isCeilingApplied).toBe(false);
      expect(result.current.socialSecuritySavings).toBe(0);
      expect(result.current.socialSecurityBase).toBe(2000);
    });
  });

  describe('Hourly rate mode calculations', () => {
    test('should calculate correctly for hourly rate input', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // Switch to hourly mode
      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(50);
        result.current.setHoursPerMonth(160);
      });

      // Expected gross salary: 50 EUR/h * 1.95583 * 160h = 15,646.64 BGN
      const expectedGrossSalary = 50 * EUR_TO_BGN_RATE * 160;
      expect(result.current.currentGrossSalary).toBeCloseTo(expectedGrossSalary);
      expect(result.current.currentHourlyRateBgn).toBeCloseTo(50 * EUR_TO_BGN_RATE); // 97.79 BGN/h
    });
  });

  describe('Social security ceiling application', () => {
    test('should apply ceiling for high salaries', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // Set a salary above the ceiling
      act(() => {
        result.current.setGrossSalary(5000); // Above 4130 BGN ceiling
      });

      expect(result.current.isCeilingApplied).toBe(true);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
      
      // Employee contributions should be calculated on ceiling amount
      expect(result.current.employeeSocialSecurity.pension).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.0978);
      expect(result.current.employeeSocialSecurity.total).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.1378);
      
      // Employer contributions should be calculated on ceiling amount (except work accidents)
      expect(result.current.employerSocialSecurity.pension).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.1292);
      expect(result.current.employerSocialSecurity.workAccidents).toBeCloseTo(5000 * 0.002); // Applied to full salary
      
      // Calculate expected savings
      const excessAmount = 5000 - SOCIAL_SECURITY_CEILING_BGN;
      const expectedSavings = excessAmount * (0.1378 + 0.1892); // Employee + employer rates
      expect(result.current.socialSecuritySavings).toBeCloseTo(expectedSavings);
    });

    test('should apply ceiling in hourly mode for high rates', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // Set a high hourly rate that exceeds ceiling
      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(200); // High rate
        result.current.setHoursPerMonth(160);
      });

      const expectedGrossSalary = 200 * EUR_TO_BGN_RATE * 160; // > 4130 BGN
      expect(result.current.currentGrossSalary).toBeCloseTo(expectedGrossSalary);
      expect(result.current.isCeilingApplied).toBe(true);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
    });
  });

  describe('Currency formatting', () => {
    test('should format BGN currency correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const formatted = result.current.formatCurrency(1000, 'BGN');
      expect(formatted).toMatch(/1.*000.*лв/); // Should contain amount and BGN symbol
    });

    test('should format EUR currency correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const formatted = result.current.formatCurrency(1956, 'EUR'); // 1956 BGN = ~1000 EUR
      expect(formatted).toMatch(/1.*000.*€/); // Should contain converted amount and EUR symbol
    });

    test('should handle currency conversion in formatting', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // 1956 BGN should format as ~1000 EUR
      const formatted = result.current.formatCurrency(1956, 'EUR');
      const eurAmount = 1956 / EUR_TO_BGN_RATE;
      
      // Check that it contains EUR symbol and reasonable numeric value
      expect(formatted).toMatch(/€/);
      expect(formatted).toMatch(/1[.,]0/); // Should contain "1.0" or "1,0" pattern for ~1000
    });
  });

  describe('Ratios and percentages', () => {
    test('should calculate net to gross ratio correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const netToGrossRatio = (result.current.netSalary / result.current.currentGrossSalary) * 100;
      expect(result.current.netToGrossRatio).toBeCloseTo(netToGrossRatio);
      expect(result.current.netToGrossRatio).toBeGreaterThan(0);
      expect(result.current.netToGrossRatio).toBeLessThan(100);
    });

    test('should calculate cost to net ratio correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const costToNetRatio = (result.current.totalCostToCompany / result.current.netSalary) * 100;
      expect(result.current.totalCostRatio).toBeCloseTo(costToNetRatio);
      expect(result.current.totalCostRatio).toBeGreaterThan(100); // Cost should be higher than net
    });
  });

  describe('State updates', () => {
    test('should update input mode correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setInputMode('hourly');
      });

      expect(result.current.inputMode).toBe('hourly');
    });

    test('should update currency correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setCurrency('EUR');
      });

      expect(result.current.currency).toBe('EUR');
    });

    test('should update gross salary and recalculate', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const initialNetSalary = result.current.netSalary;

      act(() => {
        result.current.setGrossSalary(3000);
      });

      expect(result.current.currentGrossSalary).toBe(3000);
      expect(result.current.netSalary).not.toBe(initialNetSalary); // Should recalculate
    });

    test('should update hourly rate and recalculate', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(75);
      });

      const expectedGrossSalary = 75 * EUR_TO_BGN_RATE * 160;
      expect(result.current.currentGrossSalary).toBeCloseTo(expectedGrossSalary);
    });
  });

  describe('Edge cases', () => {
    test('should handle zero values gracefully', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(0);
      });

      expect(result.current.currentGrossSalary).toBe(0);
      expect(result.current.netSalary).toBe(0);
      expect(result.current.totalCostToCompany).toBe(0);
    });

    test('should handle very small hours per month', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setHoursPerMonth(1);
      });

      expect(result.current.hoursPerMonth).toBe(1);
      expect(result.current.currentHourlyRateBgn).toBe(result.current.currentGrossSalary);
    });
  });
});