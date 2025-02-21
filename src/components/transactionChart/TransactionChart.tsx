import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
    Filler,
} from 'chart.js';
import './transactionChart.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip, Filler);

const COLORS = {
    Deposit: '#4CAF50',
    Withdrawal: '#F44336',
    Transfer: '#2196F3',
    Credit: '#FFC107',
};

const TransactionChart = ({ transactions, sourceAccountNumber }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        if (!transactions || transactions.length === 0) {
            setChartData(null);
            return;
        }

        const dailyTypeTotals = {}; // { '2025-03-27': { Deposit: 100, Withdrawal: 50, ... } }

        transactions.forEach((tx) => {
            const rawDate = new Date(tx.transactionDate);
            rawDate.setHours(0, 0, 0, 0);
            const dateKey = rawDate.toISOString().split('T')[0];

            let type = tx.transactionType?.split('_')[1];
            if (!type) return;
            type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

            if (type === 'Transfer' && tx.targetAccountNumber === sourceAccountNumber) {
                type = 'Credit';
            }

            if (!dailyTypeTotals[dateKey]) {
                dailyTypeTotals[dateKey] = { Deposit: 0, Withdrawal: 0, Transfer: 0, Credit: 0 };
            }

            if (dailyTypeTotals[dateKey][type] !== undefined) {
                dailyTypeTotals[dateKey][type] += tx.amount;
            }
        });

        const sortedDates = Object.keys(dailyTypeTotals).sort();
        const labels = sortedDates.map((d) => {
            const currentDate = new Date(d);
            // Get timezone offset in minutes and convert to milliseconds
            const offsetInMs = currentDate.getTimezoneOffset() * 60 * 1000;
            // Create a new Date adjusted for the timezone
            const adjustedDate = new Date(currentDate.getTime() + offsetInMs);

            return adjustedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const datasets = Object.keys(COLORS).map((type) => ({
            label: type,
            data: sortedDates.map((d) => dailyTypeTotals[d][type]),
            borderColor: COLORS[type],
            backgroundColor: `${COLORS[type]}22`,
            fill: true,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 5,
        }));

        setChartData({ labels, datasets });
    }, [transactions, sourceAccountNumber]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
            tooltip: {
                callbacks: {
                    label: (context) => `$${context.raw.toFixed(2)} ${context.dataset.label}`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: (value) => `$${value}`,
                },
            },
        },
    };

    return (
        <div className="shadow-lg rounded-lg bg-white overflow-hidden px-6 py-4 card overflow-hidden">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Daily Transaction Breakdown</h4>
            {chartData ? (
                <div className="w-full h-[300px] border border-gray-300 rounded-lg">
                    <Line data={chartData} options={options} />
                </div>
            ) : (
                <div className="w-full h-full bg-blue-100 text-blue-600 rounded-lg p-4">
                    <p>No transaction data available.</p>
                </div>
            )}
        </div>
    );
};

export default TransactionChart;
