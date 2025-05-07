import React from 'react';
import {
  VStack, Stat, StatLabel, StatNumber, StatHelpText,
  Flex, Badge, useColorModeValue
} from '@chakra-ui/react';
import { formatCurrency } from '../../utils/CurrencyFormatter';
import ParameterControl from './ParameterControl';

interface CalculatorControlsProps {
  initialAmount: number;
  monthlyDeposit: number;
  interestRate: number;
  finalValue: number | null;
  onInitialAmountChange: (value: number) => void;
  onMonthlyDepositChange: (value: number) => void;
  onInterestRateChange: (value: number) => void;
}

/**
 * Component that renders the parameter controls and displays the final projection value
 * 
 * @param initialAmount - Starting investment amount
 * @param monthlyDeposit - Monthly contribution amount
 * @param interestRate - Annual interest rate
 * @param finalValue - Calculated value after 50 years
 * @param onInitialAmountChange - Callback for when initial amount changes
 * @param onMonthlyDepositChange - Callback for when monthly deposit changes
 * @param onInterestRateChange - Callback for when interest rate changes
 * @returns A component with sliders and inputs for calculator parameters
 */
const CalculatorControls: React.FC<CalculatorControlsProps> = ({
  initialAmount,
  monthlyDeposit,
  interestRate,
  finalValue,
  onInitialAmountChange,
  onMonthlyDepositChange,
  onInterestRateChange
}) => {
  // Theme colors
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'white');
  const finalValueColor = useColorModeValue('green.500', 'green.300');

  return (
    <VStack spacing={6} align="stretch">
      {/* Initial Amount Control */}
      <ParameterControl
        label="Initial Amount"
        value={initialAmount}
        min={0}
        max={50000}
        step={100}
        onChange={onInitialAmountChange}
        minLabel="0"
        maxLabel="50,000"
        formatType="currency"
      />

      {/* Monthly Deposit Control */}
      <ParameterControl
        label="Monthly Deposit"
        value={monthlyDeposit}
        min={0}
        max={5000}
        step={10}
        onChange={onMonthlyDepositChange}
        minLabel="0"
        maxLabel="5,000"
        formatType="currency"
      />

      {/* Interest Rate Control */}
      <ParameterControl
        label="Interest Rate"
        value={interestRate}
        min={0}
        max={15}
        step={0.1}
        precision={1}
        suffix="%"
        onChange={onInterestRateChange}
        minLabel="0"
        maxLabel="15"
        formatType="percentage"
      />

      {/* Statistics */}
      <Stat
        p={4}
        borderRadius="md"
        borderWidth="1px"
        borderColor={borderColor}
        bg={useColorModeValue('blue.50', 'blue.900')}
        mt={4}
      >
        <Flex align="center">
          <StatLabel color={textColor}>After 50 Years</StatLabel>
          <Badge ml={2} colorScheme="blue" variant="subtle">PROJECTION</Badge>
        </Flex>
        <StatNumber fontSize="2xl" color={finalValueColor} fontWeight="bold" mt={2}>
          {finalValue ? formatCurrency(finalValue) : formatCurrency(0)}
        </StatNumber>
        <StatHelpText fontSize="sm" mb={0}>
          Initial investment: {formatCurrency(initialAmount)}
        </StatHelpText>
      </Stat>
    </VStack>
  );
};

export default CalculatorControls;
