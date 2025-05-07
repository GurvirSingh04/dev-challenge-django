import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import userEvent from '@testing-library/user-event';
import ParameterControl from '../components/calculator/ParameterControl';

// Wrap the component in ChakraProvider for tests
const renderWithChakra = (ui: React.ReactElement) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

describe('ParameterControl', () => {
  const mockOnChange = jest.fn();
  
  beforeEach(() => {
    mockOnChange.mockClear();
  });
  
  test('renders with correct label and default value', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Label"
        value={100}
        min={0}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    expect(screen.getByText('Test Label:')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toHaveValue("100"); // Using string value
  });
  
  test('renders with currency format', () => {
    renderWithChakra(
      <ParameterControl
        label="Initial Amount"
        value={1000}
        min={0}
        max={10000}
        step={100}
        onChange={mockOnChange}
        formatType="currency"
      />
    );
    
    expect(screen.getByText('£')).toBeInTheDocument();
  });
  
  test('renders with percentage format', () => {
    renderWithChakra(
      <ParameterControl
        label="Interest Rate"
        value={5}
        min={0}
        max={15}
        step={0.1}
        precision={1}
        onChange={mockOnChange}
        formatType="percentage"
      />
    );
    
    expect(screen.getByText('%')).toBeInTheDocument();
  });
  
  test('handles input value changes', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Input"
        value={100}
        min={0}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.blur(input);
    
    expect(mockOnChange).toHaveBeenCalledWith(200);
  });
  
  test('clamps value to max on blur', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Input"
        value={100}
        min={0}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '2000' } });
    fireEvent.blur(input);
    
    expect(mockOnChange).toHaveBeenCalledWith(1000);
  });
  
  test('clamps value to min on blur', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Input"
        value={100}
        min={10}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '-20' } });
    fireEvent.blur(input);
    
    expect(mockOnChange).toHaveBeenCalledWith(10);
  });
  
  test('handles empty input by setting to 0', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Input"
        value={100}
        min={0}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);
    
    expect(mockOnChange).toHaveBeenCalledWith(0);
  });
  
  test('sliders exist', () => {
    renderWithChakra(
      <ParameterControl
        label="Test Input"
        value={100}
        min={0}
        max={1000}
        step={10}
        onChange={mockOnChange}
      />
    );
    
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
  });
});
