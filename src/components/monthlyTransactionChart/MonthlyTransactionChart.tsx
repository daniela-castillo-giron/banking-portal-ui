import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend,
    Tooltip,
} from 'chart.js';
import './monthlyTransactionChart.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip);

const MonthlyTransactionChart = ({ transactions, sourceAccountNumber }) => {
    const [barData, setBarData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        if (!transactions || transactions.length === 0) return;

        const monthlyData = {};

        transactions.forEach((transaction) => {
            const date = new Date(transaction.transactionDate);
            const monthYear = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });

            if (!monthlyData[monthYear]) {
                monthlyData[monthYear] = {
                    CASH_DEPOSIT: 0,
                    CASH_WITHDRAWAL: 0,
                    CASH_TRANSFER: 0,
                    CASH_CREDIT: 0,
                };
            }

            if (
                transaction.transactionType === 'CASH_TRANSFER' &&
                transaction.targetAccountNumber === sourceAccountNumber
            ) {
                monthlyData[monthYear].CASH_CREDIT += transaction.amount;
            } else {
                monthlyData[monthYear][transaction.transactionType] += transaction.amount;
            }
        });

        const sortedMonths = Object.keys(monthlyData).sort();

        setBarData({
            labels: sortedMonths,
            datasets: [
                {
                    label: 'Deposit',
                    data: sortedMonths.map((month) => monthlyData[month].CASH_DEPOSIT),
                    backgroundColor: '#4CAF50',
                },
                {
                    label: 'Withdrawal',
                    data: sortedMonths.map((month) => monthlyData[month].CASH_WITHDRAWAL),
                    backgroundColor: '#F44336',
                },
                {
                    label: 'Transfer',
                    data: sortedMonths.map((month) => monthlyData[month].CASH_TRANSFER),
                    backgroundColor: '#2196F3',
                },
                {
                    label: 'Credit',
                    data: sortedMonths.map((month) => monthlyData[month].CASH_CREDIT),
                    backgroundColor: '#FFC107',
                },
            ],
        });
    }, [transactions, sourceAccountNumber]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: 'top' },
        },
    };

    return (
        <div className="shadow-lg rounded-lg bg-white overflow-hidden px-6 py-4 card overflow-hidden">
            <div className="mb-2">
                <h4 className="text-lg font-semibold text-gray-800">Monthly Transaction Chart</h4>
            </div>
            <div className="w-full h-64 border border-gray-300 rounded-lg">
                <Bar data={barData} options={options} />
            </div>
        </div>
    );
};

export default MonthlyTransactionChart;
