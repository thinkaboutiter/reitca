import React from 'react';
import { render, screen } from '@testing-library/react';
import { HourlyRateBreakdown } from '../../components/salary-calculator/ui/HourlyRateBreakdown';
import { getCountryConfig } from '../../config/countries';

describe('HourlyRateBreakdown Component', () => {
  const countryConfig = getCountryConfig('BG');
  const EUR_TO_BGN_RATE = countryConfig.currency.exchangeRates.EUR;

  const defaultProps = {
    currentHourlyRateBgn: 97.79,
    netHourlyRateBgn: 84.31,
    costPerHourBgn: 102.82,
    netToGrossRatio: 86.2,
    EUR_TO_BGN_RATE,
    formatCurrency: jest.fn()
  };

  beforeEach(() => {
    // Mock formatCurrency to simulate the real behavior
    defaultProps.formatCurrency.mockImplementation((amount, currency) => {
      if (currency === 'EUR') {
        const eurAmount = amount / EUR_TO_BGN_RATE;
        return `${eurAmount.toFixed(2)} €`;
      }
      return `${amount.toFixed(2)} лв.`;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should render all rate breakdown sections', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    expect(screen.getByText('Hourly Rate Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Gross Rate')).toBeInTheDocument();
    expect(screen.getByText('Net Rate')).toBeInTheDocument();
    expect(screen.getByText('Cost to Company')).toBeInTheDocument();
    expect(screen.getByText('Efficiency')).toBeInTheDocument();
  });

  test('should call formatCurrency with correct parameters for gross rate', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    // Should call formatCurrency for both EUR and BGN display
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(97.79, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(97.79, 'BGN');
  });

  test('should call formatCurrency with correct parameters for net rate', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(84.31, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(84.31, 'BGN');
  });

  test('should call formatCurrency with correct parameters for cost rate', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(102.82, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(102.82, 'BGN');
  });

  test('should display efficiency percentage correctly', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    expect(screen.getByText('86.2%')).toBeInTheDocument();
    expect(screen.getByText('Net/Gross')).toBeInTheDocument();
  });

  test('should not double-convert currency values', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    // Verify that formatCurrency is called with the original BGN amount
    // and NOT with a pre-converted amount
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(97.79, 'EUR');
    expect(defaultProps.formatCurrency).not.toHaveBeenCalledWith(97.79 / EUR_TO_BGN_RATE, 'EUR');
  });

  test('should render with different hourly rates', () => {
    const customProps = {
      ...defaultProps,
      currentHourlyRateBgn: 195.58, // Higher rate
      netHourlyRateBgn: 168.62,
      costPerHourBgn: 205.64
    };

    render(<HourlyRateBreakdown {...customProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(195.58, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(195.58, 'BGN');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(168.62, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(168.62, 'BGN');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(205.64, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(205.64, 'BGN');
  });

  test('should handle zero values gracefully', () => {
    const zeroProps = {
      ...defaultProps,
      currentHourlyRateBgn: 0,
      netHourlyRateBgn: 0,
      costPerHourBgn: 0,
      netToGrossRatio: 0
    };

    render(<HourlyRateBreakdown {...zeroProps} />);

    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(0, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(0, 'BGN');
    expect(screen.getByText('0.0%')).toBeInTheDocument();
  });

  test('should render correct CSS classes for styling', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    // Check for specific styling classes on the parent containers
    expect(screen.getByText('Gross Rate').parentElement).toHaveClass('bg-blue-50');
    expect(screen.getByText('Net Rate').parentElement).toHaveClass('bg-green-50');
    expect(screen.getByText('Cost to Company').parentElement).toHaveClass('bg-red-50');
    expect(screen.getByText('Efficiency').parentElement).toHaveClass('bg-purple-50');
  });

  test('should display rates with /h suffix', () => {
    render(<HourlyRateBreakdown {...defaultProps} />);

    // Should display EUR rates with /h
    expect(screen.getAllByText(/€\/h/)).toHaveLength(3); // Gross, Net, Cost
    // Should display BGN rates with /h
    expect(screen.getAllByText(/лв\.\/h/)).toHaveLength(3); // Gross, Net, Cost
  });

  test('should maintain mathematical relationships between rates', () => {
    const props = {
      ...defaultProps,
      currentHourlyRateBgn: 100,
      netHourlyRateBgn: 86.2, // 86.2% of gross
      costPerHourBgn: 118.92, // Gross + employer contributions
      netToGrossRatio: 86.2
    };

    render(<HourlyRateBreakdown {...props} />);

    // Verify the efficiency percentage matches the net/gross ratio
    expect(screen.getByText('86.2%')).toBeInTheDocument();
    
    // Verify all rates are formatted
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(100, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(86.2, 'EUR');
    expect(defaultProps.formatCurrency).toHaveBeenCalledWith(118.92, 'EUR');
  });
});