export interface ProjectionPoint {
    month: number;
    value: number;
  }
  
  export interface ProjectionResponse {
    data: ProjectionPoint[];
    meta: {
      total_months: number;
      final_value: number;
      parameters: {
        initial_amount: number;
        monthly_deposit: number;
        interest_rate: number;
        years: number;
      };
    };
  }
  
  export interface CalculatorInputs {
    initialAmount: number;
    monthlyDeposit: number;
    interestRate: number;
  }
  