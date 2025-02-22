import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js';
import { getAccountNumberFromToken } from '../transaction/Transaction';
import './transaction-linechart.css';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Legend, Tooltip);

const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const TransactionLineChart = ({ transactions }) => {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(monthsList[new Date().getMonth()]);
    const [years, setYears] = useState([]);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const chartRef = useRef(null);
    const userAccount = getAccountNumberFromToken();

    useEffect(() => {
        if (transactions.length) {
            initializeYearList();
            updateChart();
        }
    }, [transactions]);

    useEffect(() => {
        updateChart();
    }, [selectedYear, selectedMonth]);

    const initializeYearList = () => {
        const uniqueYears = [...new Set(transactions.map(t => new Date(t.transactionDate).getFullYear()))];
        setYears(uniqueYears);
    };

    const updateChart = () => {
        const filtered = transactions.filter((t) => {
            const date = new Date(t.transactionDate);
            return date.getFullYear() === Number(selectedYear) && monthsList[date.getMonth()] === selectedMonth;
        });

        const grouped = filtered.reduce((acc, t) => {
            const dateStr = new Date(t.transactionDate).toISOString().split('T')[0];
            if (!acc[dateStr]) {
                acc[dateStr] = {
                    date: new Date(t.transactionDate),
                    amounts: { CASH_DEPOSIT: 0, CASH_WITHDRAWAL: 0, CASH_TRANSFER: 0, CASH_CREDIT: 0 },
                };
            }

            if (t.transactionType === 'CASH_TRANSFER' && t.targetAccountNumber === userAccount) {
                acc[dateStr].amounts.CASH_CREDIT += t.amount;
            } else {
                acc[dateStr].amounts[t.transactionType] += t.amount;
            }
            return acc;
        }, {});

        const sorted = Object.values(grouped).sort((a, b) => a.date - b.date);

        const labels = sorted.map(g => g.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
        const dataset = (type) => sorted.map(g => g.amounts[type]);

        setChartData({
            labels,
            datasets: [
                { label: 'Deposit', data: dataset('CASH_DEPOSIT'), borderColor: '#4ade80', fill: false },
                { label: 'Withdrawal', data: dataset('CASH_WITHDRAWAL'), borderColor: '#f87171', fill: false },
                { label: 'Fund Transfer', data: dataset('CASH_TRANSFER'), borderColor: '#60a5fa', fill: false },
                { label: 'Fund Credit', data: dataset('CASH_CREDIT'), borderColor: '#facc15', fill: false },
            ],
        });
    };

    return (
        <div className="bg-white card rounded-lg overflow-hidden px-6 py-4">
            <div className="flex justify-between mb-2">
                <h4 className="text-2xl font-semibold text-gray-800">Transaction</h4>
                <div className="flex gap-2">
                    <select
                        className="p-2 border rounded-lg"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>

                    <select
                        className="p-2 border rounded-lg"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthsList.map((month) => (
                            <option key={month} value={month}>{month}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="w-full h-96 border border-gray-300 rounded-lg">
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: true, position: 'top' },
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default TransactionLineChart;
