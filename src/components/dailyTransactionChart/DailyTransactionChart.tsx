import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
} from 'chart.js';
import './dailyTransactionChart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const DailyTransactionChart = ({ transactions }) => {
    const [barData, setBarData] = useState({
        labels: [],
        datasets: [],
    });

    const chartRef = useRef(null);

    useEffect(() => {
        if (!transactions || transactions.length === 0) return;

        // Group transactions by Month-Year and transaction type
        const monthlyData = {};
        transactions.forEach((transaction) => {
            const date = new Date(transaction.transactionDate);
            const monthYear = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });

            if (!monthlyData[monthYear]) monthlyData[monthYear] = {};
            if (!monthlyData[monthYear][transaction.transactionType]) {
                monthlyData[monthYear][transaction.transactionType] = transaction.amount;
            } else {
                monthlyData[monthYear][transaction.transactionType] += transaction.amount;
            }
        });

        const sortedMonthYears = Object.keys(monthlyData).sort();
        const transactionTypes = [
            ...new Set(transactions.map((t) => t.transactionType)),
        ];

        const datasets = transactionTypes.map((type) => ({
            label: type,
            data: sortedMonthYears.map(
                (month) => monthlyData[month][type] || 0
            ),
            backgroundColor: getRandomColor(),
        }));

        setBarData({
            labels: sortedMonthYears,
            datasets,
        });
    }, [transactions]);

    const getRandomColor = () =>
        `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
            Math.random() * 255
        )}, ${Math.floor(Math.random() * 255)}, 0.6)`;

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
        },
    };

    return (
        <div className="w-full h-96">
            <Bar ref={chartRef} data={barData} options={options} />
        </div>
    );
};

export default DailyTransactionChart;
