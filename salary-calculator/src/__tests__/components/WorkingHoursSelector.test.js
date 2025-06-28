import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { WorkingHoursSelector } from '../../components/salary-calculator/ui/WorkingHoursSelector';
import { getCountryConfig } from '../../config/countries';

describe('WorkingHoursSelector Component', () => {
  const countryConfig = getCountryConfig('BG');
  const mockOnMethodChange = jest.fn();

  const defaultProps = {
    selectedMethod: 'legal',
    onMethodChange: mockOnMethodChange,
    workingHoursMethods: countryConfig.workingHoursMethods,
    currentHours: 176
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render component with title and info box', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    expect(screen.getByText('Working Hours Calculation Method')).toBeInTheDocument();
    expect(screen.getByText('Choose how monthly working hours are calculated')).toBeInTheDocument();
    expect(screen.getByText(/This affects hourly rate calculations/)).toBeInTheDocument();
  });

  test('should render all working hours methods', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    expect(screen.getByText('Legal Standard (Bulgaria)')).toBeInTheDocument();
    expect(screen.getByText('Simplified (4 weeks)')).toBeInTheDocument();
    expect(screen.getByText('Weekly Average')).toBeInTheDocument();
    
    expect(screen.getByText('176 hrs/month')).toBeInTheDocument();
    expect(screen.getByText('160 hrs/month')).toBeInTheDocument();
    expect(screen.getByText('173 hrs/month')).toBeInTheDocument();
  });

  test('should show correct selected method', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    const legalRadio = screen.getByDisplayValue('legal');
    const simplifiedRadio = screen.getByDisplayValue('simplified');
    const weeklyRadio = screen.getByDisplayValue('weekly');

    expect(legalRadio).toBeChecked();
    expect(simplifiedRadio).not.toBeChecked();
    expect(weeklyRadio).not.toBeChecked();
  });

  test('should call onMethodChange when different method is selected', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    const simplifiedRadio = screen.getByDisplayValue('simplified');
    fireEvent.click(simplifiedRadio);

    expect(mockOnMethodChange).toHaveBeenCalledWith('simplified');
  });

  test('should show current hours in summary', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    expect(screen.getByText('Currently using:')).toBeInTheDocument();
    expect(screen.getByText('176 hours per month')).toBeInTheDocument();
  });

  test('should highlight legal method as recommended', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    const legalMethodContainer = screen.getByText('Legal Standard (Bulgaria)').closest('label');
    expect(legalMethodContainer).toHaveClass('border-blue-500', 'bg-blue-50');
  });

  test('should show method descriptions correctly', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    expect(screen.getByText('22 working days × 8 hours')).toBeInTheDocument();
    expect(screen.getByText('4 weeks × 5 days × 8 hours')).toBeInTheDocument();
    expect(screen.getByText('40 hours/week × 4.33 weeks')).toBeInTheDocument();
  });

  test('should show detailed calculation breakdown', () => {
    render(<WorkingHoursSelector {...defaultProps} />);

    expect(screen.getByText('22 working days × 8 hours/day = 176 hours/month')).toBeInTheDocument();
    expect(screen.getByText('20 working days × 8 hours/day = 160 hours/month')).toBeInTheDocument();
    expect(screen.getByText('22 working days × 8 hours/day = 173 hours/month')).toBeInTheDocument();
  });

  test('should work with different selected method', () => {
    const propsWithSimplified = {
      ...defaultProps,
      selectedMethod: 'simplified',
      currentHours: 160
    };

    render(<WorkingHoursSelector {...propsWithSimplified} />);

    const simplifiedRadio = screen.getByDisplayValue('simplified');
    expect(simplifiedRadio).toBeChecked();
    expect(screen.getByText('160 hours per month')).toBeInTheDocument();
  });

  test('should update current hours when different method is selected', () => {
    const { rerender } = render(<WorkingHoursSelector {...defaultProps} />);

    // Click simplified method
    const simplifiedRadio = screen.getByDisplayValue('simplified');
    fireEvent.click(simplifiedRadio);

    // Simulate parent component updating currentHours
    rerender(
      <WorkingHoursSelector 
        {...defaultProps} 
        selectedMethod="simplified" 
        currentHours={160} 
      />
    );

    expect(screen.getByText('160 hours per month')).toBeInTheDocument();
  });
});