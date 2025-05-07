import { ProjectionResponse } from '../types/CalculatorTypes';
import { config } from '../config/appConfig';

/**
 * Fetches savings projection data from the API
 * 
 * @param initialAmount - The starting investment amount
 * @param monthlyDeposit - The monthly contribution amount
 * @param interestRate - The annual interest rate (in percent)
 * @returns Promise that resolves to projection data with monthly values
 * @throws Error if the API request fails with the error message from the server
 */
export const fetchProjections = async (
  initialAmount: number,
  monthlyDeposit: number,
  interestRate: number
): Promise<ProjectionResponse> => {
  // Build query string with parameters
  const params = new URLSearchParams({
    initial_amount: initialAmount.toString(),
    monthly_deposit: monthlyDeposit.toString(),
    interest_rate: interestRate.toString(),
  });

  const url = `${config.api.baseUrl}${config.api.projectionEndpoint}?${params}`;
  
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch projection data');
  }

  return await response.json();
};
