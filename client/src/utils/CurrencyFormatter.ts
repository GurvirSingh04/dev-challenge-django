/**
 * Formats a numeric value as GBP currency
 * @param value - The numeric value to format
 * @returns A formatted string with pound symbol (e.g., "£1,234")
 */
export const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
    