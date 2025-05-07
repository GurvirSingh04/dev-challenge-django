import { formatCurrency } from '../utils/CurrencyFormatter';


describe('CurrencyFormatter', () => {
  test('formats whole numbers correctly', () => {
    expect(formatCurrency(1234)).toBe('£1,234');
    expect(formatCurrency(0)).toBe('£0');
    expect(formatCurrency(1000000)).toBe('£1,000,000');
  });

  test('formats decimal numbers correctly', () => {
    expect(formatCurrency(1234.56)).toBe('£1,234.56');
    expect(formatCurrency(0.99)).toBe('£0.99');
    expect(formatCurrency(1000000.01)).toBe('£1,000,000.01');
  });

  test('handles negative numbers correctly', () => {
    expect(formatCurrency(-1234)).toBe('-£1,234');
    expect(formatCurrency(-0.99)).toBe('-£0.99');
  });

  test('trims excess decimal places to maximum of 2', () => {
    expect(formatCurrency(123.456)).toBe('£123.46');
    expect(formatCurrency(0.999)).toBe('£1');
  });
});
