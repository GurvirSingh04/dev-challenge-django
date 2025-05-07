import { renderHook } from '@testing-library/react-hooks';
import { useSavingsProjection } from '../hooks/useSavingsProjection';
import { fetchProjections } from '../services/CalculatorApi';

jest.mock('../config/appConfig', () => ({
  config: {
    api: {
      baseUrl: 'http://localhost:8000/api',
      projectionEndpoint: '/projections/',
    },
    defaults: {
      initialAmount: 10000,
      monthlyDeposit: 200,
      interestRate: 5,
      years: 50,
    },
    ui: {
      debounceMs: 300,
    }
  }
}));

// Mock the API service
jest.mock('../services/CalculatorApi');

describe('useSavingsProjection', () => {
  const mockApiResponse = {
    data: [
      { month: 0, value: 1000 },
      { month: 12, value: 1060 },
      { month: 24, value: 1123.6 }
    ],
    meta: {
      total_months: 24,
      final_value: 1123.6,
      parameters: {
        initial_amount: 1000,
        monthly_deposit: 0,
        interest_rate: 6,
        years: 2
      }
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchProjections as jest.Mock).mockResolvedValue(mockApiResponse);
  });
  
  test('should fetch data and process it correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => 
      useSavingsProjection(1000, 0, 6)
    );
    
    // Initial state before data is fetched
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.xAxisData).toEqual([]);
    expect(result.current.yAxisData).toEqual([]);
    expect(result.current.finalValue).toBeNull();
    
    // Wait for API call to complete
    await waitForNextUpdate();
    
    // Check the processed data
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.xAxisData).toEqual(['Start', 'Year 1', 'Year 2']);
    expect(result.current.yAxisData).toEqual(['1000', '1060', '1123.6']);
    expect(result.current.finalValue).toBe(1123.6);
    
    // Verify the API was called with correct parameters
    expect(fetchProjections).toHaveBeenCalledWith(1000, 0, 6);
  });
  
  test('should handle API errors', async () => {
    const errorMessage = 'Network error';
    (fetchProjections as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    const { result, waitForNextUpdate } = renderHook(() => 
      useSavingsProjection(1000, 0, 6)
    );
    
    await waitForNextUpdate();
    
    // Check error state
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.xAxisData).toEqual([]);
    expect(result.current.yAxisData).toEqual([]);
    expect(result.current.finalValue).toBeNull();
  });
  
  test('should re-fetch when input parameters change', async () => {
    const { rerender, waitForNextUpdate } = renderHook(
      ({ initialAmount, monthlyDeposit, interestRate }) => 
        useSavingsProjection(initialAmount, monthlyDeposit, interestRate),
      { initialProps: { initialAmount: 1000, monthlyDeposit: 0, interestRate: 6 } }
    );
    
    await waitForNextUpdate();
    expect(fetchProjections).toHaveBeenCalledTimes(1);
    
    // Change parameter and verify it triggers a new API call
    rerender({ initialAmount: 2000, monthlyDeposit: 0, interestRate: 6 });
    await waitForNextUpdate();
    
    expect(fetchProjections).toHaveBeenCalledTimes(2);
    expect(fetchProjections).toHaveBeenLastCalledWith(2000, 0, 6);
  });
});
