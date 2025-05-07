import { useState, useEffect, useMemo } from 'react';
import { fetchProjections } from '../services/CalculatorApi';
import { ProjectionResponse } from '../types/CalculatorTypes';

/**
 * Custom hook that provides savings projection data based on input parameters
 * 
 * @param initialAmount - The starting investment amount
 * @param monthlyDeposit - The monthly contribution amount
 * @param interestRate - The annual interest rate (in percent)
 * @returns Object containing chart data, loading state, error state and final investment value
 */
export function useSavingsProjection(initialAmount: number, monthlyDeposit: number, interestRate: number) {
  const [projectionData, setProjectionData] = useState<ProjectionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches projection data from the API and updates state accordingly
     */
    const getProjectionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProjections(initialAmount, monthlyDeposit, interestRate);
        setProjectionData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getProjectionData();
  }, [initialAmount, monthlyDeposit, interestRate]);

  // Memoized values derived from projectionData
  const xAxisData = useMemo(() => {
    if (!projectionData?.data) return [];
    return projectionData.data.map(point => {
      const year = Math.floor(point.month / 12);
      return year === 0 ? 'Start' : `Year ${year}`;
    });
  }, [projectionData?.data]);

  const yAxisData = useMemo(() => {
    if (!projectionData?.data) return [];
    return projectionData.data.map(point => point.value.toString());
  }, [projectionData?.data]);

  const finalValue = projectionData?.meta.final_value || null;

  return { xAxisData, yAxisData, loading, error, finalValue };
}
