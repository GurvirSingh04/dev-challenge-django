import { renderHook, act } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce';

describe('useDebounce hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial value', 500));
    expect(result.current).toBe('initial value');
  });

  test('should update value after specified delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // Update the value
    rerender({ value: 'updated value', delay: 500 });
    
    // Value should not change immediately
    expect(result.current).toBe('initial value');
    
    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now the value should be updated
    expect(result.current).toBe('updated value');
  });

  test('should cancel previous timeout when value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial value', delay: 500 } }
    );

    // First update
    rerender({ value: 'first update', delay: 500 });
    
    // Fast-forward time but not completely
    act(() => {
      jest.advanceTimersByTime(250);
    });
    
    // Second update before the first completes
    rerender({ value: 'second update', delay: 500 });
    
    // Fast-forward time past when first update would happen
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Should show second update
    expect(result.current).toBe('second update');
  });

  test('should handle different types of values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 123, delay: 200 } }
    );
    
    expect(result.current).toBe(123);
    
    rerender({ value: 456, delay: 200 });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    expect(result.current).toBe(456);
  });

  test('should work with different delay values', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'test', delay: 100 } }
    );
    
    rerender({ value: 'updated', delay: 100 });
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    expect(result.current).toBe('updated');
    
    // Change delay and value
    rerender({ value: 'new delay', delay: 300 });
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    
    // Should not update yet (only 200ms passed, delay is 300ms)
    expect(result.current).toBe('updated');
    
    act(() => {
      jest.advanceTimersByTime(100);
    });
    
    // Now it should update (300ms total)
    expect(result.current).toBe('new delay');
  });
});
