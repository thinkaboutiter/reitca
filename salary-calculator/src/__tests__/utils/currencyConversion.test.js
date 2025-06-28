import { renderHook } from '@testing-library/react';
import { useSalaryCalculation } from '../../components/salary-calculator/hooks/useSalaryCalculation';
import { getCountryConfig } from '../../config/countries';

describe('Currency Conversion Logic', () => {
  const countryConfig = getCountryConfig('BG');
  const EUR_TO_BGN_RATE = countryConfig.currency.exchangeRates.EUR;

  describe('formatCurrency function', () => {
    test('should convert BGN to EUR correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      // Test conversion: 1956 BGN should be ~1000 EUR
      const bgnAmount = 1956;
      const formatted = result.current.formatCurrency(bgnAmount, 'EUR');
      
      // Extract the numeric value (remove currency symbols and formatting)
      const numericMatch = formatted.match(/[\d.,]+/);
      expect(numericMatch).not.toBeNull();
      
      const numericValue = parseFloat(numericMatch[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      const expectedEurValue = bgnAmount / EUR_TO_BGN_RATE;
      
      expect(numericValue).toBeCloseTo(expectedEurValue, 2);
    });

    test('should format BGN without conversion', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const bgnAmount = 1000;
      const formatted = result.current.formatCurrency(bgnAmount, 'BGN');
      
      // Should contain the original amount
      expect(formatted).toContain('1000');
      expect(formatted).toMatch(/лв/); // Should contain BGN symbol
    });

    test('should handle decimal places correctly', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const amount = 1234.56;
      const formattedBGN = result.current.formatCurrency(amount, 'BGN');
      const formattedEUR = result.current.formatCurrency(amount, 'EUR');
      
      // Both should have decimal places
      expect(formattedBGN).toMatch(/\d+[.,]\d{2}/);
      expect(formattedEUR).toMatch(/\d+[.,]\d{2}/);
    });
  });

  describe('Double conversion prevention', () => {
    test('should not double-convert when formatCurrency is called with EUR', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      // Test the exact scenario that was causing double conversion
      const bgnHourlyRate = 97.79; // BGN per hour
      
      // This should convert once: 97.79 BGN → ~50 EUR
      const formatted = result.current.formatCurrency(bgnHourlyRate, 'EUR');
      
      // Extract numeric value
      const numericMatch = formatted.match(/[\d.,]+/);
      const numericValue = parseFloat(numericMatch[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      
      // Should be around 50 EUR, not 25 EUR (which would indicate double conversion)
      expect(numericValue).toBeCloseTo(50, 0);
      expect(numericValue).toBeGreaterThan(45);
      expect(numericValue).toBeLessThan(55);
    });

    test('should maintain mathematical consistency', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const testAmounts = [100, 500, 1000, 2000, 5000];
      
      testAmounts.forEach(bgnAmount => {
        const eurFormatted = result.current.formatCurrency(bgnAmount, 'EUR');
        const bgnFormatted = result.current.formatCurrency(bgnAmount, 'BGN');
        
        // Extract numeric values
        const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
        const bgnNumeric = parseFloat(bgnFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
        
        // Verify the conversion is mathematically correct
        expect(bgnNumeric).toBeCloseTo(bgnAmount, 2);
        expect(eurNumeric).toBeCloseTo(bgnAmount / EUR_TO_BGN_RATE, 2);
        
        // Verify reverse conversion (allow for small floating point errors)
        expect(eurNumeric * EUR_TO_BGN_RATE).toBeCloseTo(bgnAmount, 1);
      });
    });
  });

  describe('Hourly rate conversion scenarios', () => {
    test('should correctly convert hourly rates from BGN to EUR', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      // Scenario: 50 EUR/h input should result in 97.79 BGN/h gross rate
      const eurHourlyInput = 50;
      const expectedBgnHourly = eurHourlyInput * EUR_TO_BGN_RATE;
      
      // When displaying in EUR, should show original 50 EUR
      const eurFormatted = result.current.formatCurrency(expectedBgnHourly, 'EUR');
      const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      
      expect(eurNumeric).toBeCloseTo(eurHourlyInput, 1);
      
      // When displaying in BGN, should show converted amount
      const bgnFormatted = result.current.formatCurrency(expectedBgnHourly, 'BGN');
      const bgnNumeric = parseFloat(bgnFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      
      expect(bgnNumeric).toBeCloseTo(expectedBgnHourly, 1);
    });

    test('should handle net hourly rate conversions', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      // Test with calculated net hourly rate
      const grossHourlyBgn = 97.79;
      const netHourlyBgn = grossHourlyBgn * 0.862; // Approximate net ratio
      
      const eurFormatted = result.current.formatCurrency(netHourlyBgn, 'EUR');
      const bgnFormatted = result.current.formatCurrency(netHourlyBgn, 'BGN');
      
      const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      const bgnNumeric = parseFloat(bgnFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      
      // Verify mathematical relationship
      expect(eurNumeric * EUR_TO_BGN_RATE).toBeCloseTo(bgnNumeric, 1);
    });
  });

  describe('Monthly salary conversion scenarios', () => {
    test('should correctly convert monthly salaries', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const monthlySalaries = [1000, 2000, 3000, 4130, 5000]; // Including ceiling amount
      
      monthlySalaries.forEach(bgnSalary => {
        const eurFormatted = result.current.formatCurrency(bgnSalary, 'EUR');
        const bgnFormatted = result.current.formatCurrency(bgnSalary, 'BGN');
        
        const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
        const bgnNumeric = parseFloat(bgnFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
        
        expect(bgnNumeric).toBeCloseTo(bgnSalary, 2);
        expect(eurNumeric).toBeCloseTo(bgnSalary / EUR_TO_BGN_RATE, 2);
      });
    });
  });

  describe('Precision and rounding', () => {
    test('should maintain precision in conversions', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const precisionTestAmount = 1234.567; // BGN
      
      const eurFormatted = result.current.formatCurrency(precisionTestAmount, 'EUR');
      const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      
      // Should maintain reasonable precision
      const expectedEur = precisionTestAmount / EUR_TO_BGN_RATE;
      expect(eurNumeric).toBeCloseTo(expectedEur, 2);
    });

    test('should format with appropriate decimal places', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const amount = 1000;
      const eurFormatted = result.current.formatCurrency(amount, 'EUR');
      const bgnFormatted = result.current.formatCurrency(amount, 'BGN');
      
      // Should have exactly 2 decimal places
      expect(eurFormatted).toMatch(/\d+[.,]\d{2}/);
      expect(bgnFormatted).toMatch(/\d+[.,]\d{2}/);
    });
  });

  describe('Edge cases', () => {
    test('should handle zero amounts', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const eurFormatted = result.current.formatCurrency(0, 'EUR');
      const bgnFormatted = result.current.formatCurrency(0, 'BGN');
      
      expect(eurFormatted).toContain('0');
      expect(bgnFormatted).toContain('0');
    });

    test('should handle very large amounts', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const largeAmount = 999999.99;
      const eurFormatted = result.current.formatCurrency(largeAmount, 'EUR');
      const bgnFormatted = result.current.formatCurrency(largeAmount, 'BGN');
      
      expect(eurFormatted).toBeTruthy();
      expect(bgnFormatted).toBeTruthy();
      
      // Should not crash and should contain reasonable values
      const eurNumeric = parseFloat(eurFormatted.match(/[\d.,]+/)[0].replace(/[.,]/g, match => match === ',' ? '.' : ''));
      expect(eurNumeric).toBeCloseTo(largeAmount / EUR_TO_BGN_RATE, 0);
    });

    test('should handle very small amounts', () => {
      const { result } = renderHook(() => useSalaryCalculation());
      
      const smallAmount = 0.01;
      const eurFormatted = result.current.formatCurrency(smallAmount, 'EUR');
      const bgnFormatted = result.current.formatCurrency(smallAmount, 'BGN');
      
      expect(eurFormatted).toBeTruthy();
      expect(bgnFormatted).toBeTruthy();
    });
  });
});