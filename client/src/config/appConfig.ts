export const config = {
    api: {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
      projectionEndpoint: import.meta.env.VITE_API_PROJECTION_ENDPOINT || '/projections/',
    },
    defaults: {
      initialAmount: Number(import.meta.env.VITE_DEFAULT_INITIAL_AMOUNT) || 10000,
      monthlyDeposit: Number(import.meta.env.VITE_DEFAULT_MONTHLY_DEPOSIT) || 200,
      interestRate: Number(import.meta.env.VITE_DEFAULT_INTEREST_RATE) || 5,
      years: Number(import.meta.env.VITE_DEFAULT_YEARS) || 50,
    },
    ui: {
      debounceMs: Number(import.meta.env.VITE_DEBOUNCE_MS) || 300,
    }
  };
  