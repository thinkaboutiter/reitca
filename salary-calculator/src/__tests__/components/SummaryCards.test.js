import React from 'react';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from '../../components/salary-calculator/ui/SummaryCards';
import { getCountryConfig } from '../../config/countries';

describe('SummaryCards Component', () => {
  const countryConfig = getCountryConfig('BG');
  const EUR_TO_BGN_RATE = countryConfig.currency.exchangeRates.EUR;

  const defaultProps = {
    netSalary: 1724.4,
    totalTaxesPaid: 654.8,
    netToGrossRatio: 86.22,
    totalCostRatio: 138.16,
    currency: 'BGN',
    formatCurrency: jest.fn()
  };

  beforeEach(() => {
    // Mock formatCurrency to simulate the real behavior
    defaultProps.formatCurrency.mockImplementation((amount, currency) => {
      if (currency === 'EUR') {
        const eurAmount = amount / EUR_TO_BGN_RATE;
        return `€${eurAmount.toFixed(2)}`;
      }
      return `${amount.toFixed(2)} лв.`;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering with BGN currency', () => {
    test('should render all summary cards', () => {
      render(<SummaryCards {...defaultProps} />);

      expect(screen.getByText('Net Salary')).toBeInTheDocument();
      expect(screen.getByText('Total Taxes')).toBeInTheDocument();
      expect(screen.getByText('Net/Gross Ratio')).toBeInTheDocument();
      expect(screen.getByText('Cost/Net Ratio')).toBeInTheDocument();
    });

    test('should call formatCurrency with correct parameters for BGN', () => {
      render(<SummaryCards {...defaultProps} />);

      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(1724.4, 'BGN');
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(654.8, 'BGN');
    });

    test('should not show BGN conversion when currency is BGN', () => {
      render(<SummaryCards {...defaultProps} />);

      // Should not show additional BGN amounts when already in BGN
      expect(defaultProps.formatCurrency).toHaveBeenCalledTimes(2); // Only main amounts
    });

    test('should display correct percentage values', () => {
      render(<SummaryCards {...defaultProps} />);

      expect(screen.getByText('86.2%')).toBeInTheDocument();
      expect(screen.getByText('138.2%')).toBeInTheDocument();
    });
  });

  describe('Rendering with EUR currency', () => {
    const eurProps = {
      ...defaultProps,
      currency: 'EUR'
    };

    test('should call formatCurrency with EUR for main amounts', () => {
      render(<SummaryCards {...eurProps} />);

      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(1724.4, 'EUR');
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(654.8, 'EUR');
    });

    test('should show BGN conversion when currency is EUR', () => {
      render(<SummaryCards {...eurProps} />);

      // Should call formatCurrency for BGN conversion as well
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(1724.4, 'BGN');
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(654.8, 'BGN');
      
      // Total calls: 2 for EUR main amounts + 2 for BGN conversions
      expect(defaultProps.formatCurrency).toHaveBeenCalledTimes(4);
    });
  });

  describe('Currency conversion fixes', () => {
    test('should not double-convert currency values', () => {
      const eurProps = { ...defaultProps, currency: 'EUR' };
      render(<SummaryCards {...eurProps} />);

      // Should pass the original BGN amount to formatCurrency
      // The formatCurrency function handles the conversion internally
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(1724.4, 'EUR');
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(654.8, 'EUR');
      
      // Should NOT call with pre-divided amounts
      expect(defaultProps.formatCurrency).not.toHaveBeenCalledWith(1724.4 / EUR_TO_BGN_RATE, 'EUR');
      expect(defaultProps.formatCurrency).not.toHaveBeenCalledWith(654.8 / EUR_TO_BGN_RATE, 'EUR');
    });

    test('should maintain mathematical consistency', () => {
      const testValues = [
        { netSalary: 1000, totalTaxes: 300 },
        { netSalary: 2000, totalTaxes: 600 },
        { netSalary: 3000, totalTaxes: 900 }
      ];

      testValues.forEach(({ netSalary, totalTaxes }) => {
        const props = {
          ...defaultProps,
          netSalary,
          totalTaxesPaid: totalTaxes,
          currency: 'EUR'
        };

        render(<SummaryCards {...props} />);

        // Verify correct values are passed to formatCurrency
        expect(defaultProps.formatCurrency).toHaveBeenCalledWith(netSalary, 'EUR');
        expect(defaultProps.formatCurrency).toHaveBeenCalledWith(totalTaxes, 'EUR');
        expect(defaultProps.formatCurrency).toHaveBeenCalledWith(netSalary, 'BGN');
        expect(defaultProps.formatCurrency).toHaveBeenCalledWith(totalTaxes, 'BGN');

        // Clean up for next iteration
        defaultProps.formatCurrency.mockClear();
      });
    });
  });

  describe('Icons and styling', () => {
    test('should display correct icons for each card', () => {
      render(<SummaryCards {...defaultProps} />);

      // Check that icon containers are present (we can't easily test for specific icons)
      const netSalaryCard = screen.getByText('Net Salary').closest('.flex');
      const totalTaxesCard = screen.getByText('Total Taxes').closest('.flex');
      
      expect(netSalaryCard).toBeInTheDocument();
      expect(totalTaxesCard).toBeInTheDocument();
    });

    test('should apply correct CSS classes', () => {
      render(<SummaryCards {...defaultProps} />);

      const gridContainer = screen.getByText('Net Salary').closest('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });
  });

  describe('Edge cases', () => {
    test('should handle zero values', () => {
      const zeroProps = {
        ...defaultProps,
        netSalary: 0,
        totalTaxesPaid: 0,
        netToGrossRatio: 0,
        totalCostRatio: 0
      };

      render(<SummaryCards {...zeroProps} />);

      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(0, 'BGN');
      expect(screen.getAllByText('0.0%')).toHaveLength(2); // Both ratio cards show 0.0%
    });

    test('should handle large values', () => {
      const largeProps = {
        ...defaultProps,
        netSalary: 999999.99,
        totalTaxesPaid: 500000.50,
        netToGrossRatio: 99.9,
        totalCostRatio: 200.1
      };

      render(<SummaryCards {...largeProps} />);

      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(999999.99, 'BGN');
      expect(defaultProps.formatCurrency).toHaveBeenCalledWith(500000.50, 'BGN');
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('200.1%')).toBeInTheDocument();
    });

    test('should handle decimal ratios correctly', () => {
      const decimalProps = {
        ...defaultProps,
        netToGrossRatio: 86.23456,
        totalCostRatio: 138.16789
      };

      render(<SummaryCards {...decimalProps} />);

      // Should round to 1 decimal place
      expect(screen.getByText('86.2%')).toBeInTheDocument();
      expect(screen.getByText('138.2%')).toBeInTheDocument();
    });
  });

  describe('Currency switching behavior', () => {
    test('should show different content when switching between currencies', () => {
      const { rerender } = render(<SummaryCards {...defaultProps} />);

      // Initially in BGN - should have 2 calls
      expect(defaultProps.formatCurrency).toHaveBeenCalledTimes(2);

      // Switch to EUR
      defaultProps.formatCurrency.mockClear();
      rerender(<SummaryCards {...defaultProps} currency="EUR" />);

      // In EUR - should have 4 calls (2 for EUR display + 2 for BGN conversion)
      expect(defaultProps.formatCurrency).toHaveBeenCalledTimes(4);
    });
  });

  describe('Accessibility', () => {
    test('should have proper semantic structure', () => {
      render(<SummaryCards {...defaultProps} />);

      // Cards should be properly structured
      const netSalaryText = screen.getByText('Net Salary');
      const totalTaxesText = screen.getByText('Total Taxes');
      const netGrossRatioText = screen.getByText('Net/Gross Ratio');
      const costNetRatioText = screen.getByText('Cost/Net Ratio');

      expect(netSalaryText).toBeInTheDocument();
      expect(totalTaxesText).toBeInTheDocument();
      expect(netGrossRatioText).toBeInTheDocument();
      expect(costNetRatioText).toBeInTheDocument();
    });
  });
});