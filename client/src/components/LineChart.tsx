import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TooltipItem,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import theme from '../theme'

import { formatCurrency } from '../utils/CurrencyFormatter';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

type Props = {
    xAxisData: string[]
    yAxisData: string[]
    title?: string
    xLabel?: string
    yLabel?: string
}

const LineChart = ({ xAxisData, yAxisData, title, xLabel, yLabel }: Props) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: !!title,
                text: title,
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem: TooltipItem<'line'>) {
                        const rawValue = tooltipItem.raw as number | undefined;
                        return rawValue !== undefined
                            ? `Value: ${formatCurrency(rawValue)}`
                            : 'Value: N/A';
                    }
                },

            },
        },
        scales: {
            y: {
                title: {
                    display: !!yLabel,
                    text: yLabel,
                },
                grid: {
                    display: false,
                },
            },
            x: {
                title: {
                    display: !!xLabel,
                    text: xLabel,
                },
                grid: {
                    display: false,
                },
            },
        },
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <Line
                data={{
                    labels: xAxisData,
                    datasets: [
                        {
                            backgroundColor: theme.colors.blue100,
                            borderColor: theme.colors.primary,
                            data: yAxisData,
                        },
                    ],
                }}
                options={options}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}

export default LineChart
