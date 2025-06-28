import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CountrySelector } from '../../components/salary-calculator/ui/CountrySelector';

describe('CountrySelector Component', () => {
  const mockOnCountryChange = jest.fn();

  const defaultProps = {
    selectedCountryCode: 'BG',
    onCountryChange: mockOnCountryChange,
    countries: [
      { code: 'BG', name: 'Bulgaria', currency: 'BGN' }
    ],
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component with title and info box', () => {
    render(<CountrySelector {...defaultProps} />);

    expect(screen.getByText('Country Selection')).toBeInTheDocument();
    expect(screen.getByText('Select your country for accurate tax calculations')).toBeInTheDocument();
    expect(screen.getByText(/Each country has different tax rates/)).toBeInTheDocument();
  });

  test('should render country button with correct information', () => {
    render(<CountrySelector {...defaultProps} />);

    expect(screen.getAllByText('Bulgaria')).toHaveLength(2); // Button and summary
    expect(screen.getByText('Currency: BGN')).toBeInTheDocument();
    expect(screen.getByText('BG')).toBeInTheDocument(); // Country code flag
  });

  test('should show selected country as highlighted', () => {
    render(<CountrySelector {...defaultProps} />);

    const countryButton = screen.getByRole('button');
    expect(countryButton).toHaveClass('border-blue-500', 'bg-blue-50');
    
    // Check icon should be present for selected country
    const checkIcon = countryButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('should call onCountryChange when country is clicked', () => {
    render(<CountrySelector {...defaultProps} />);

    const countryButton = screen.getByRole('button');
    fireEvent.click(countryButton);

    expect(mockOnCountryChange).toHaveBeenCalledWith('BG');
  });

  test('should show current selection in summary', () => {
    render(<CountrySelector {...defaultProps} />);

    expect(screen.getByText('Currently selected:')).toBeInTheDocument();
    expect(screen.getAllByText('Bulgaria')).toHaveLength(2); // Button and summary
  });

  test('should sort countries alphabetically', () => {
    const multipleCountriesProps = {
      ...defaultProps,
      countries: [
        { code: 'FR', name: 'France', currency: 'EUR' },
        { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
        { code: 'DE', name: 'Germany', currency: 'EUR' }
      ]
    };

    render(<CountrySelector {...multipleCountriesProps} />);

    const countryButtons = screen.getAllByRole('button');
    const countryNames = countryButtons.map(button => 
      button.querySelector('span')?.textContent
    ).filter(Boolean);

    // Should be sorted: Bulgaria, France, Germany
    expect(countryNames[0]).toContain('Bulgaria');
    expect(countryNames[1]).toContain('France'); 
    expect(countryNames[2]).toContain('Germany');
  });

  test('should show coming soon message when only one country', () => {
    render(<CountrySelector {...defaultProps} />);

    expect(screen.getByText('🚧 More countries coming soon!')).toBeInTheDocument();
    expect(screen.getByText(/We're working on adding support for Germany/)).toBeInTheDocument();
  });

  test('should not show coming soon message with multiple countries', () => {
    const multipleCountriesProps = {
      ...defaultProps,
      countries: [
        { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
        { code: 'DE', name: 'Germany', currency: 'EUR' }
      ]
    };

    render(<CountrySelector {...multipleCountriesProps} />);

    expect(screen.queryByText('🚧 More countries coming soon!')).not.toBeInTheDocument();
  });

  test('should handle disabled state', () => {
    const disabledProps = {
      ...defaultProps,
      disabled: true
    };

    render(<CountrySelector {...disabledProps} />);

    const countryButton = screen.getByRole('button');
    expect(countryButton).toBeDisabled();
    expect(countryButton).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  test('should not call onCountryChange when disabled', () => {
    const disabledProps = {
      ...defaultProps,
      disabled: true
    };

    render(<CountrySelector {...disabledProps} />);

    const countryButton = screen.getByRole('button');
    fireEvent.click(countryButton);

    expect(mockOnCountryChange).not.toHaveBeenCalled();
  });

  test('should handle no selection', () => {
    const noSelectionProps = {
      ...defaultProps,
      selectedCountryCode: null
    };

    render(<CountrySelector {...noSelectionProps} />);

    expect(screen.getByText('None selected')).toBeInTheDocument();
  });

  test('should display country code as flag placeholder', () => {
    render(<CountrySelector {...defaultProps} />);

    const flagElement = screen.getByText('BG');
    expect(flagElement).toHaveClass('w-8', 'h-6', 'rounded', 'border');
  });

  test('should handle multiple currencies correctly', () => {
    const multiCurrencyProps = {
      ...defaultProps,
      countries: [
        { code: 'BG', name: 'Bulgaria', currency: 'BGN' },
        { code: 'DE', name: 'Germany', currency: 'EUR' },
        { code: 'FR', name: 'France', currency: 'EUR' }
      ]
    };

    render(<CountrySelector {...multiCurrencyProps} />);

    expect(screen.getByText('Currency: BGN')).toBeInTheDocument();
    expect(screen.getAllByText('Currency: EUR')).toHaveLength(2);
  });
});