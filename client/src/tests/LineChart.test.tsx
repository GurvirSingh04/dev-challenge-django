import { render } from '@testing-library/react';
import LineChart from '../components/LineChart';

// Mock Chart.js implementation
jest.mock('react-chartjs-2', () => ({
  Line: jest.fn().mockImplementation(({ data, options }) => (
    <div data-testid="mock-line-chart">
      <span>MockChart</span>
      <pre data-testid="chart-data">{JSON.stringify(data, null, 2)}</pre>
      <pre data-testid="chart-options">{JSON.stringify(options, null, 2)}</pre>
    </div>
  ))
}));

describe('LineChart', () => {
  const sampleProps = {
    xAxisData: ['Start', 'Year 1', 'Year 2'],
    yAxisData: ['1000', '1200', '1440'],
    title: 'Test Chart',
    xLabel: 'Time',
    yLabel: 'Value'
  };
  
  test('renders the chart with provided data', () => {
    const { getByTestId } = render(<LineChart {...sampleProps} />);
    
    const chartData = JSON.parse(getByTestId('chart-data').textContent || '{}');
    
    expect(chartData.labels).toEqual(sampleProps.xAxisData);
    expect(chartData.datasets[0].data).toEqual(sampleProps.yAxisData);
  });
  
  test('sets chart title when provided', () => {
    const { getByTestId } = render(<LineChart {...sampleProps} />);
    
    const chartOptions = JSON.parse(getByTestId('chart-options').textContent || '{}');
    
    expect(chartOptions.plugins.title.display).toBe(true);
    expect(chartOptions.plugins.title.text).toBe('Test Chart');
  });
  
  test('sets axis labels when provided', () => {
    const { getByTestId } = render(<LineChart {...sampleProps} />);
    
    const chartOptions = JSON.parse(getByTestId('chart-options').textContent || '{}');
    
    expect(chartOptions.scales.x.title.display).toBe(true);
    expect(chartOptions.scales.x.title.text).toBe('Time');
    expect(chartOptions.scales.y.title.display).toBe(true);
    expect(chartOptions.scales.y.title.text).toBe('Value');
  });
  
  test('handles empty data', () => {
    const { getByTestId } = render(
      <LineChart
        xAxisData={[]}
        yAxisData={[]}
        title="Empty Chart"
      />
    );
    
    const chartData = JSON.parse(getByTestId('chart-data').textContent || '{}');
    
    expect(chartData.labels).toEqual([]);
    expect(chartData.datasets[0].data).toEqual([]);
  });
});
