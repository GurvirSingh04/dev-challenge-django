import React from 'react';
import { Box, Spinner, Alert, AlertIcon, Flex } from '@chakra-ui/react';
import LineChart from '../LineChart';

interface ChartContainerProps {
  loading: boolean;
  error: string | null;
  xAxisData: string[];
  yAxisData: string[];
}

/**
 * Container component that handles different states of the chart (loading, error, or showing data)
 * 
 * @param loading - Whether data is currently being loaded
 * @param error - Error message if any, or null if no error
 * @param xAxisData - Data for the chart's x-axis (labels)
 * @param yAxisData - Data for the chart's y-axis (values)
 * @returns A component that displays a spinner during loading, error message on error, or chart with data
 */
const ChartContainer: React.FC<ChartContainerProps> = ({
  loading,
  error,
  xAxisData,
  yAxisData
}) => {
  if (loading) {
    return (
      <Flex justify="center" align="center" h="100%" w="100%">
        <Spinner size="xl" thickness="4px" color="blue.500" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" alignItems="center" borderRadius="md">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <LineChart 
      xAxisData={xAxisData}
      yAxisData={yAxisData}
      title="Projected Savings Growth"
      xLabel="Time (Years)"
      yLabel="Value"
    />
  );
};

export default React.memo(ChartContainer);
