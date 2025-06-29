import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SalaryCalculator from '../../components/salary-calculator/SalaryCalculator';
import { getCountryConfig } from '../../config/countries';

describe('Salary Calculator Integration Tests', () => {
  const countryConfig = getCountryConfig('BG');
  const EUR_TO_BGN_RATE = countryConfig.currency.exchangeRates.EUR;
  const SOCIAL_SECURITY_CEILING_BGN = countryConfig.socialSecurity.ceiling.monthly;

  describe('Complete calculator flow', () => {
    test('should render calculator correctly', async () => {
      render(<SalaryCalculator />);

      // Verify initial state
      expect(screen.getByDisplayValue(countryConfig.defaults.grossSalary.toString())).toBeInTheDocument(); // Default gross salary
      expect(screen.getByText('Monthly Salary')).toBeInTheDocument();

      // Check that calculations are displayed
      await waitFor(() => {
        expect(screen.getByText('Hourly Rate Breakdown')).toBeInTheDocument();
        expect(screen.getAllByText('Employee Pays').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Company Pays').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Net Salary').length).toBeGreaterThan(0);
      });
    });

    test('should switch between monthly and hourly modes correctly', async () => {
      render(<SalaryCalculator />);

      // Switch to hourly mode
      const hourlyModeButton = screen.getByText('Hourly Rate');
      fireEvent.click(hourlyModeButton);

      // Verify hourly mode is active
      await waitFor(() => {
        expect(screen.getByDisplayValue(countryConfig.defaults.hourlyRateEur.toString())).toBeInTheDocument(); // Default hourly rate
        expect(screen.getByDisplayValue(countryConfig.defaults.hoursPerMonth.toString())).toBeInTheDocument(); // Default hours
        expect(screen.getByText('Monthly Gross (BGN)')).toBeInTheDocument();
      });

      // Switch back to monthly mode
      const monthlyModeButton = screen.getByText('Monthly Salary');
      fireEvent.click(monthlyModeButton);

      // Verify monthly mode is active
      await waitFor(() => {
        expect(screen.getByDisplayValue('2000')).toBeInTheDocument();
      });
    });

    test('should switch between BGN and EUR currencies correctly', async () => {
      render(<SalaryCalculator />);

      // Initially in BGN
      expect(screen.getByText('BGN').closest('button')).toHaveClass('bg-white');

      // Switch to EUR
      const eurButton = screen.getByText('EUR');
      fireEvent.click(eurButton);

      // Verify EUR is selected
      await waitFor(() => {
        expect(eurButton.closest('button')).toHaveClass('bg-white');
      });

      // Switch back to BGN
      const bgnButton = screen.getByText('BGN');
      fireEvent.click(bgnButton);

      // Verify BGN is selected
      await waitFor(() => {
        expect(bgnButton.closest('button')).toHaveClass('bg-white');
      });
    });

    test('should update calculations when gross salary changes', async () => {
      render(<SalaryCalculator />);

      // Get initial net salary text
      const initialContent = screen.getAllByText('Net Salary')[0].parentElement.textContent;

      // Change gross salary
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '3000' } });

      // Wait for calculations to update
      await waitFor(() => {
        const updatedContent = screen.getAllByText('Net Salary')[0].parentElement.textContent;
        expect(updatedContent).not.toBe(initialContent);
      });
    });

    test('should use predefined hourly rates correctly', async () => {
      render(<SalaryCalculator />);

      // Switch to hourly mode
      fireEvent.click(screen.getByText('Hourly Rate'));

      // Click on a predefined rate
      await waitFor(() => {
        const rate100Button = screen.getByText('€100');
        fireEvent.click(rate100Button);

        // Verify the hourly rate input was updated
        expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      });
    });
  });

  describe('Social security ceiling integration', () => {
    test('should show ceiling indicator for high salaries', async () => {
      render(<SalaryCalculator />);

      // Set a high salary above the ceiling
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '5000' } });

      // Wait for ceiling indicator to appear
      await waitFor(() => {
        expect(screen.getByText(/Ceiling Applied/)).toBeInTheDocument();
      });
    });

    test('should show ceiling indicator in hourly mode for high rates', async () => {
      render(<SalaryCalculator />);

      // Switch to hourly mode
      fireEvent.click(screen.getByText('Hourly Rate'));

      // Set a high hourly rate
      await waitFor(() => {
        const hourlyInput = screen.getByDisplayValue('50');
        fireEvent.change(hourlyInput, { target: { value: '200' } });
      });

      // Wait for ceiling indicator to appear
      await waitFor(() => {
        expect(screen.getByText(/Ceiling Applied/)).toBeInTheDocument();
      });
    });

    test('should show asterisks for capped contributions in breakdown table', async () => {
      render(<SalaryCalculator />);

      // Set a high salary
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '6000' } });

      // Wait for asterisks to appear in the table
      await waitFor(() => {
        const asterisks = screen.getAllByText('*');
        expect(asterisks.length).toBeGreaterThan(0);
      });

      // Should show ceiling explanation
      await waitFor(() => {
        expect(screen.getByText(/Contribution capped at/)).toBeInTheDocument();
      });
    });
  });

  describe('Currency conversion integration', () => {
    test('should display correct EUR values when EUR currency is selected', async () => {
      render(<SalaryCalculator />);

      // Switch to EUR currency
      fireEvent.click(screen.getByText('EUR'));

      // Verify EUR amounts are displayed in summary cards
      await waitFor(() => {
        const netSalaryCard = screen.getAllByText('Net Salary')[0].parentElement;
        expect(netSalaryCard.textContent).toMatch(/€/);
      });
    });

    test('should show BGN conversion below EUR amounts', async () => {
      render(<SalaryCalculator />);

      // Switch to EUR currency
      fireEvent.click(screen.getByText('EUR'));

      // Wait for both EUR and BGN amounts to be displayed
      await waitFor(() => {
        const netSalaryCard = screen.getAllByText('Net Salary')[0].parentElement;
        expect(netSalaryCard.textContent).toMatch(/€/);
        expect(netSalaryCard.textContent).toMatch(/лв/);
      });
    });
  });

  describe('Complete calculation flow validation', () => {
    test('should calculate a realistic scenario correctly', async () => {
      render(<SalaryCalculator />);

      // Set up a realistic scenario: 3000 BGN monthly salary
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '3000' } });

      await waitFor(() => {
        // Verify main sections are rendered
        expect(screen.getByText('Hourly Rate Breakdown')).toBeInTheDocument();
        expect(screen.getByText('Employee Pays')).toBeInTheDocument();
        expect(screen.getAllByText('Company Pays').length).toBeGreaterThan(0);
        expect(screen.getByText('Complete Breakdown')).toBeInTheDocument();

        // Verify key calculations exist
        expect(screen.getAllByText('Net Salary').length).toBeGreaterThan(0);
        expect(screen.getByText('Total Taxes')).toBeInTheDocument();
        expect(screen.getByText('Net/Gross Ratio')).toBeInTheDocument();
        expect(screen.getByText('Cost/Net Ratio')).toBeInTheDocument();
      });
    });

    test('should handle hourly to monthly conversion correctly', async () => {
      render(<SalaryCalculator />);

      // Switch to hourly mode
      fireEvent.click(screen.getByText('Hourly Rate'));

      // Expected monthly gross for 50 EUR/h with 160 hours should be around 15,646 BGN
      await waitFor(() => {
        const monthlyGrossSection = screen.getByText('Monthly Gross (BGN)').parentElement;
        // Should contain a value around 15,646
        expect(monthlyGrossSection.textContent).toMatch(/15.*6/);
      });
    });
  });

  describe('Error handling and edge cases', () => {
    test('should handle zero values gracefully', async () => {
      render(<SalaryCalculator />);

      // Set salary to 0
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '0' } });

      // Should not crash and should display zero values
      await waitFor(() => {
        expect(screen.getAllByText('Net Salary').length).toBeGreaterThan(0);
      });
    });

    test('should handle very large values', async () => {
      render(<SalaryCalculator />);

      // Set a very large salary
      const salaryInput = screen.getByDisplayValue('2000');
      fireEvent.change(salaryInput, { target: { value: '50000' } });

      // Should handle large values and show ceiling indicator
      await waitFor(() => {
        expect(screen.getAllByText(/Ceiling Applied/).length).toBeGreaterThan(0);
        expect(screen.getAllByText('Net Salary').length).toBeGreaterThan(0);
      });
    });

    test('should handle decimal inputs correctly', async () => {
      render(<SalaryCalculator />);

      // Switch to hourly mode and enter decimal rate
      fireEvent.click(screen.getByText('Hourly Rate'));
      
      await waitFor(() => {
        const hourlyInput = screen.getByDisplayValue('50');
        fireEvent.change(hourlyInput, { target: { value: '37.5' } });

        // Should handle decimal calculations
        expect(screen.getByDisplayValue('37.5')).toBeInTheDocument();
      });
    });
  });
});