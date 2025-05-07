export const config = {
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
  };
  