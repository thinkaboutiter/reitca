import { renderHook, act } from '@testing-library/react';
import { useSalaryCalculation } from '../../components/salary-calculator/hooks/useSalaryCalculation';
import { getCountryConfig } from '../../config/countries';

describe('Social Security Ceiling Calculations', () => {
  const countryConfig = getCountryConfig('BG');
  const SOCIAL_SECURITY_CEILING_BGN = countryConfig.socialSecurity.ceiling.monthly;
  const EUR_TO_BGN_RATE = countryConfig.currency.exchangeRates.EUR;

  describe('Ceiling application logic', () => {
    test('should not apply ceiling for salaries below limit', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      // Test salaries below ceiling
      const testSalaries = [1000, 2000, 3000, 4000, 4129];
      
      testSalaries.forEach(salary => {
        act(() => {
          result.current.setGrossSalary(salary);
        });

        expect(result.current.isCeilingApplied).toBe(false);
        expect(result.current.socialSecurityBase).toBe(salary);
        expect(result.current.socialSecuritySavings).toBe(0);
      });
    });

    test('should apply ceiling for salaries at limit', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(SOCIAL_SECURITY_CEILING_BGN);
      });

      expect(result.current.isCeilingApplied).toBe(false); // Exactly at ceiling
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.socialSecuritySavings).toBe(0);
    });

    test('should apply ceiling for salaries above limit', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalaries = [4131, 5000, 6000, 8000, 10000];
      
      testSalaries.forEach(salary => {
        act(() => {
          result.current.setGrossSalary(salary);
        });

        expect(result.current.isCeilingApplied).toBe(true);
        expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
        
        // Calculate expected savings
        const excessAmount = salary - SOCIAL_SECURITY_CEILING_BGN;
        const expectedSavings = excessAmount * (0.1378 + 0.1892); // Employee + employer rates
        expect(result.current.socialSecuritySavings).toBeCloseTo(expectedSavings, 2);
      });
    });
  });

  describe('Employee contributions with ceiling', () => {
    test('should cap employee contributions at ceiling amount', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(6000); // Above ceiling
      });

      // All employee contributions should be calculated on ceiling amount
      expect(result.current.employeeSocialSecurity.pension).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.0978);
      expect(result.current.employeeSocialSecurity.health).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.032);
      expect(result.current.employeeSocialSecurity.unemployment).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.008);
      expect(result.current.employeeSocialSecurity.total).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.1378);
    });

    test('should calculate contributions correctly for salary below ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalary = 3000;
      act(() => {
        result.current.setGrossSalary(testSalary);
      });

      // All employee contributions should be calculated on full salary
      expect(result.current.employeeSocialSecurity.pension).toBeCloseTo(testSalary * 0.0978);
      expect(result.current.employeeSocialSecurity.health).toBeCloseTo(testSalary * 0.032);
      expect(result.current.employeeSocialSecurity.unemployment).toBeCloseTo(testSalary * 0.008);
      expect(result.current.employeeSocialSecurity.total).toBeCloseTo(testSalary * 0.1378);
    });
  });

  describe('Employer contributions with ceiling', () => {
    test('should cap most employer contributions but not work accidents', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalary = 6000;
      act(() => {
        result.current.setGrossSalary(testSalary);
      });

      // Most employer contributions should be calculated on ceiling amount
      expect(result.current.employerSocialSecurity.pension).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.1292);
      expect(result.current.employerSocialSecurity.health).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.048);
      expect(result.current.employerSocialSecurity.unemployment).toBeCloseTo(SOCIAL_SECURITY_CEILING_BGN * 0.01);
      
      // Work accidents should be calculated on full salary
      expect(result.current.employerSocialSecurity.workAccidents).toBeCloseTo(testSalary * 0.002);
      
      // Total should account for ceiling on social security + full salary for work accidents
      const expectedTotal = (SOCIAL_SECURITY_CEILING_BGN * 0.1892) + ((testSalary - SOCIAL_SECURITY_CEILING_BGN) * 0.002);
      expect(result.current.employerSocialSecurity.total).toBeCloseTo(expectedTotal);
    });

    test('should calculate all employer contributions on full salary when below ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalary = 3000;
      act(() => {
        result.current.setGrossSalary(testSalary);
      });

      expect(result.current.employerSocialSecurity.pension).toBeCloseTo(testSalary * 0.1292);
      expect(result.current.employerSocialSecurity.health).toBeCloseTo(testSalary * 0.048);
      expect(result.current.employerSocialSecurity.unemployment).toBeCloseTo(testSalary * 0.01);
      expect(result.current.employerSocialSecurity.workAccidents).toBeCloseTo(testSalary * 0.002);
      expect(result.current.employerSocialSecurity.total).toBeCloseTo(testSalary * 0.1892);
    });
  });

  describe('Ceiling application in hourly mode', () => {
    test('should apply ceiling when hourly rate results in high monthly salary', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(200); // High rate
        result.current.setHoursPerMonth(160);
      });

      const expectedMonthlySalary = 200 * EUR_TO_BGN_RATE * 160; // Should be > 4130
      expect(result.current.currentGrossSalary).toBeCloseTo(expectedMonthlySalary);
      expect(result.current.currentGrossSalary).toBeGreaterThan(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.isCeilingApplied).toBe(true);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
    });

    test('should not apply ceiling when hourly rate results in low monthly salary', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(13); // Lower rate to stay below ceiling: 13 * 1.95583 * 160 = 4074.53 BGN
        result.current.setHoursPerMonth(160);
      });

      const expectedMonthlySalary = 13 * EUR_TO_BGN_RATE * 160; // Should be < 4130
      expect(result.current.currentGrossSalary).toBeCloseTo(expectedMonthlySalary);
      expect(result.current.currentGrossSalary).toBeLessThan(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.isCeilingApplied).toBe(false);
      expect(result.current.socialSecurityBase).toBe(expectedMonthlySalary);
    });

    test('should handle varying hours per month with ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setInputMode('hourly');
        result.current.setHourlyRateEur(100);
      });

      // Test different hours that cross the ceiling threshold
      const hoursTestCases = [40, 80, 120, 160, 200]; // Some will exceed ceiling, some won't

      hoursTestCases.forEach(hours => {
        act(() => {
          result.current.setHoursPerMonth(hours);
        });

        const expectedMonthlySalary = 100 * EUR_TO_BGN_RATE * hours;
        expect(result.current.currentGrossSalary).toBeCloseTo(expectedMonthlySalary);

        if (expectedMonthlySalary > SOCIAL_SECURITY_CEILING_BGN) {
          expect(result.current.isCeilingApplied).toBe(true);
          expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
        } else {
          expect(result.current.isCeilingApplied).toBe(false);
          expect(result.current.socialSecurityBase).toBe(expectedMonthlySalary);
        }
      });
    });
  });

  describe('Savings calculation accuracy', () => {
    test('should calculate correct savings for various salary levels', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testCases = [
        { salary: 4500, expectedSavings: (4500 - 4130) * (0.1378 + 0.1892) },
        { salary: 5000, expectedSavings: (5000 - 4130) * (0.1378 + 0.1892) },
        { salary: 6000, expectedSavings: (6000 - 4130) * (0.1378 + 0.1892) },
        { salary: 8000, expectedSavings: (8000 - 4130) * (0.1378 + 0.1892) },
        { salary: 10000, expectedSavings: (10000 - 4130) * (0.1378 + 0.1892) }
      ];

      testCases.forEach(({ salary, expectedSavings }) => {
        act(() => {
          result.current.setGrossSalary(salary);
        });

        expect(result.current.socialSecuritySavings).toBeCloseTo(expectedSavings, 2);
      });
    });

    test('should calculate zero savings for salaries at or below ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalaries = [3000, 4000, 4130];

      testSalaries.forEach(salary => {
        act(() => {
          result.current.setGrossSalary(salary);
        });

        expect(result.current.socialSecuritySavings).toBe(0);
      });
    });
  });

  describe('Income tax calculation with ceiling', () => {
    test('should calculate income tax on gross minus capped social security', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(6000); // Above ceiling
      });

      // Taxable income should be gross salary minus capped employee social security
      const expectedTaxableIncome = 6000 - (SOCIAL_SECURITY_CEILING_BGN * 0.1378);
      expect(result.current.taxableIncome).toBeCloseTo(expectedTaxableIncome);

      // Income tax should be 10% of taxable income
      expect(result.current.incomeTax).toBeCloseTo(expectedTaxableIncome * 0.10);
    });

    test('should calculate income tax normally when below ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalary = 3000;
      act(() => {
        result.current.setGrossSalary(testSalary);
      });

      // Taxable income should be gross salary minus full employee social security
      const expectedTaxableIncome = testSalary - (testSalary * 0.1378);
      expect(result.current.taxableIncome).toBeCloseTo(expectedTaxableIncome);

      // Income tax should be 10% of taxable income
      expect(result.current.incomeTax).toBeCloseTo(expectedTaxableIncome * 0.10);
    });
  });

  describe('Total cost to company with ceiling', () => {
    test('should include uncapped work accidents insurance in total cost', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      const testSalary = 6000;
      act(() => {
        result.current.setGrossSalary(testSalary);
      });

      // Total cost should be gross salary + all employer contributions
      const expectedTotalCost = testSalary + result.current.employerSocialSecurity.total;
      expect(result.current.totalCostToCompany).toBeCloseTo(expectedTotalCost);

      // Verify that work accidents is calculated on full salary
      expect(result.current.employerSocialSecurity.workAccidents).toBeCloseTo(testSalary * 0.002);
    });
  });

  describe('Boundary conditions', () => {
    test('should handle salary exactly at ceiling boundary', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(SOCIAL_SECURITY_CEILING_BGN);
      });

      expect(result.current.isCeilingApplied).toBe(false);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.socialSecuritySavings).toBe(0);
    });

    test('should handle salary one unit above ceiling', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(SOCIAL_SECURITY_CEILING_BGN + 1);
      });

      expect(result.current.isCeilingApplied).toBe(true);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.socialSecuritySavings).toBeCloseTo(1 * (0.1378 + 0.1892), 4);
    });

    test('should handle ceiling with fractional salary amounts', () => {
      const { result } = renderHook(() => useSalaryCalculation());

      act(() => {
        result.current.setGrossSalary(4130.50);
      });

      expect(result.current.isCeilingApplied).toBe(true);
      expect(result.current.socialSecurityBase).toBe(SOCIAL_SECURITY_CEILING_BGN);
      expect(result.current.socialSecuritySavings).toBeCloseTo(0.5 * (0.1378 + 0.1892), 4);
    });
  });
});