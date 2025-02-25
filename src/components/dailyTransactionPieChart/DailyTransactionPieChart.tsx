import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Legend,
    Tooltip,
} from 'chart.js';
import './dailyTransactionPieChart.css';

ChartJS.register(ArcElement, Legend, Tooltip);

const DailyTransactionPieChart = ({ transactions, sourceAccountNumber }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [pieData, setPieData] = useState({ labels: [], datasets: [{ data: [] }] });

    useEffect(() => {
        const currentDate = new Date();
        // Get timezone offset in minutes and convert to milliseconds
        const offsetInMs = currentDate.getTimezoneOffset() * 60 * 1000;
        // Create a new Date adjusted for the timezone
        const adjustedDate = new Date(currentDate.getTime() - offsetInMs);

        setSelectedDate(adjustedDate.toISOString().split('T')[0]);

    }, []);

    useEffect(() => {
        updateChart();
    }, [selectedDate, transactions]);

    const updateChart = () => {
        if (!selectedDate || !transactions.length) return;

        const selectedDateObj = new Date(selectedDate);

        // Get timezone offset in minutes and convert to milliseconds
        const offsetInMs = selectedDateObj.getTimezoneOffset() * 60 * 1000;
        
        // Create a new Date adjusted for the timezone
        const adjustedDate = new Date(selectedDateObj.getTime() + offsetInMs);

        adjustedDate.setHours(0, 0, 0, 0);

        const filtered = transactions.filter((tx) => {
            const txDate = new Date(tx.transactionDate);
            txDate.setHours(0, 0, 0, 0);
            return txDate.getTime() === adjustedDate.getTime();
        });

        const typeData = { Deposit: 0, Withdrawal: 0, Transfer: 0, Credit: 0 };

        filtered.forEach((tx) => {
            let type = tx.transactionType.split('_')[1];
            type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

            if (type === 'Transfer' && tx.targetAccountNumber === sourceAccountNumber) {
                typeData.Credit += tx.amount;
            } else if (typeData.hasOwnProperty(type)) {
                typeData[type] += tx.amount;
            }
        });

        setPieData({
            labels: Object.keys(typeData),
            datasets: [
                {
                    data: Object.values(typeData),
                    backgroundColor: ['#4CAF50', '#F44336', '#2196F3', '#FFC107'],
                },
            ],
        });
    };

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
                <h4 className="mb-2 text-lg font-semibold text-gray-800">Daily Transaction Chart</h4>
                <div className="flex mb-2">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="flex-grow border rounded py-2 px-3 text-gray-700"
                        aria-label="Select date"
                    />
                </div>
            </div>

            {pieData.datasets[0].data.some((val) => val > 0) ? (
                <div className="w-full h-[205px] border border-gray-300 rounded-lg">
                    <Pie data={pieData} options={options} />
                </div>
            ) : (
                <div className="w-full h-full bg-orange-100 text-orange-500 rounded-lg p-4">
                    <p>No transaction available for this date</p>
                </div>
            )}
        </div>
    );
};

export default DailyTransactionPieChart;
