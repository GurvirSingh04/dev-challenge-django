import React, { useState } from 'react';
import { Flex, Box, useColorModeValue, Heading } from '@chakra-ui/react';
import CalculatorControls from './calculator/CalculatorControls';
import ChartContainer from './calculator/ChartContainer';
import { useSavingsProjection } from '../hooks/useSavingsProjection';
import useDebounce from '../hooks/useDebounce';
import { config } from '../config/appConfig';

/**
 * Main savings calculator component that manages state and layout
 * Combines the input controls and projection chart
 * 
 * @returns A complete savings calculator interface with controls and visualization
 */
const SavingsCalculator: React.FC = () => {
  // Input state
  const [initialAmount, setInitialAmount] = useState(config.defaults.initialAmount);
  const [monthlyDeposit, setMonthlyDeposit] = useState(config.defaults.monthlyDeposit);
  const [interestRate, setInterestRate] = useState(config.defaults.interestRate);

  /**
   * Debounce inputs to prevent excessive API calls when values change rapidly
   * Only triggers API calls after the user stops changing values for the specified delay
   */
  const debouncedInitialAmount = useDebounce(initialAmount, config.ui.debounceMs);
  const debouncedMonthlyDeposit = useDebounce(monthlyDeposit, config.ui.debounceMs);
  const debouncedInterestRate = useDebounce(interestRate, config.ui.debounceMs);

  // Use the custom hook for data fetching and transformation
  const { xAxisData, yAxisData, loading, error, finalValue } = useSavingsProjection(
    debouncedInitialAmount,
    debouncedMonthlyDeposit,
    debouncedInterestRate
  );

  // Theme colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      <Heading size="lg" mb={6}>Savings Growth Calculator</Heading>
      
      <Flex 
        direction={{ base: "column", md: "row" }}
        gap={8}
        w="100%"
      >
        {/* Controls */}
        <Box 
          width={{ base: "100%", md: "350px" }}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={5}
        >
          <CalculatorControls 
            initialAmount={initialAmount}
            monthlyDeposit={monthlyDeposit}
            interestRate={interestRate}
            finalValue={finalValue}
            onInitialAmountChange={setInitialAmount}
            onMonthlyDepositChange={setMonthlyDeposit}
            onInterestRateChange={setInterestRate}
          />
        </Box>
        
        {/* Chart */}
        <Box 
          flex="1"
          width="100%"
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          p={5}
          bg={bgColor}
          h={{ base: "300px", md: "500px" }}
          mt={{ base: 4, md: 0 }}
        >
          <ChartContainer 
            loading={loading}
            error={error}
            xAxisData={xAxisData}
            yAxisData={yAxisData}
          />
        </Box>
      </Flex>
    </Box>
  );
}

export default SavingsCalculator;
