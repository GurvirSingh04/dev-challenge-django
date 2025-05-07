import React, { useState, useEffect, KeyboardEvent } from 'react';
import {
  Box, Text, Slider, SliderTrack, SliderFilledTrack, 
  SliderThumb, Flex, useColorModeValue, NumberInput, 
  NumberInputField, NumberInputStepper, NumberIncrementStepper, 
  NumberDecrementStepper, HStack, InputGroup, InputLeftElement, InputRightElement
} from '@chakra-ui/react';

interface ParameterControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  precision?: number;
  suffix?: string;
  minLabel?: string;
  maxLabel?: string;
  onChange: (value: number) => void;
  formatType?: "currency" | "percentage" | "number";
}

/**
 * A composite control component that combines a labeled numeric input and a slider
 * Provides formatting options for displaying currency, percentage, or plain numbers
 * 
 * @param props - Component properties
 * @returns A composite numeric input control with slider
 */
const ParameterControl: React.FC<ParameterControlProps> = ({
  label,
  value,
  min,
  max,
  step,
  precision = 0,
  suffix = '',
  minLabel,
  maxLabel,
  onChange,
  formatType = "number"
}) => {
  // Local state for input value
  const [localValue, setLocalValue] = useState(value);
  
  // Theme colors
  const sliderTrackColor = useColorModeValue('blue.100', 'blue.700');
  const sliderFilledTrackColor = useColorModeValue('blue.500', 'blue.300');
  const symbolColor = useColorModeValue('gray.600', 'gray.400');
  
  // Sync local state with props when they change externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);


  /**
   * Ensures value is within specified bounds
   * @param val - The value to validate
   * @returns Value clamped between min and max
   */ 
  const validateAndClampValue = (val: number): number => {
    return Math.min(Math.max(val, min), max);
  };

    /**
   * Handles changes to the number input field
   * @param valueAsString - String representation of the input
   * @param valueAsNumber - Numeric representation of the input
   */
  const handleNumberInputChange = (valueAsString: string, valueAsNumber: number) => {
    // If the input is empty (user deleted everything), set value to 0
    if (valueAsString === '' || valueAsString === null || isNaN(valueAsNumber)) {
      setLocalValue(0);
    } else {
      setLocalValue(valueAsNumber);
    }
  };

  /**
   * Handles keyboard events, updating parent value on Enter
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const clampedValue = validateAndClampValue(localValue);
      setLocalValue(clampedValue);
      onChange(clampedValue);
    }
  };

  // Handle blur event to validate and update parent
  const handleBlur = () => {
    // If the value is null or NaN, set it to 0
    const valueToClamp = isNaN(localValue) ? 0 : localValue;
    const clampedValue = validateAndClampValue(valueToClamp);
    setLocalValue(clampedValue);
    onChange(clampedValue);
  };

  // Handle increment button click
  const handleIncrement = () => {
    const newValue = Math.min(max, localValue + step);
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Handle decrement button click
  const handleDecrement = () => {
    const newValue = Math.max(min, localValue - step);
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Handle slider change
  const handleSliderChange = (val: number) => {
    setLocalValue(val);
    onChange(val);
  };

  // Determine if we need currency symbol (£) or percentage (%)
  const isCurrency = formatType === "currency";
  const isPercentage = formatType === "percentage";

  return (
    <Box>
      <HStack mb={2} justify="space-between">
        <Text fontWeight="medium">{label}:</Text>
        <InputGroup size="md" width="auto" maxW="170px">
          {isCurrency && (
            <InputLeftElement
              pointerEvents="none"
              color={symbolColor}
              fontSize="sm"
              fontWeight="medium"
              children="£"
            />
          )}
          <NumberInput
            value={localValue}
            min={min}
            max={max}
            step={step}
            precision={precision}
            onChange={handleNumberInputChange}
            onBlur={handleBlur}
            clampValueOnBlur={true}
            keepWithinRange={true}
            width="full"
          >
            <NumberInputField 
              onKeyDown={handleKeyDown}
              pl={isCurrency ? "8" : "4"}
              pr={isPercentage ? "60px" : "36px"} 
              textAlign="right"
              paddingRight={isPercentage ? "60px" : "36px"}
            />
            <NumberInputStepper width="32px">
              <NumberIncrementStepper onClick={handleIncrement} />
              <NumberDecrementStepper onClick={handleDecrement} />
            </NumberInputStepper>
          </NumberInput>
          {isPercentage && (
            <InputRightElement
              pointerEvents="none"
              color={symbolColor}
              fontSize="sm"
              fontWeight="medium"
              children="%"
              right="40px"
              width="16px" 
            />
          )}
        </InputGroup>
      </HStack>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={handleSliderChange}
        aria-label={`${label} slider`}
      >
        <SliderTrack bg={sliderTrackColor}>
          <SliderFilledTrack bg={sliderFilledTrackColor} />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Flex justify="space-between" mt={1}>
        <Text fontSize="xs" color="gray.500">
          {isCurrency ? '£' : ''}{minLabel || min}{isPercentage ? '%' : ''}
        </Text>
        <Text fontSize="xs" color="gray.500">
          {isCurrency ? '£' : ''}{maxLabel || max}{isPercentage ? '%' : ''}
        </Text>
      </Flex>
    </Box>
  );
};

export default React.memo(ParameterControl);
