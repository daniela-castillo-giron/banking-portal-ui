import React, { useEffect, useState } from 'react';
import TransactionChart from '../transactionChart/TransactionChart';
import DailyTransactionPieChart from '../dailyTransactionPieChart/DailyTransactionPieChart';
import MonthlyTransactionChart from '../monthlyTransactionChart/MonthlyTransactionChart';
import DownloadTransactions from '../downloadTransactions/DownloadTransactions';
import { getAccountNumberFromToken } from '../transaction/Transaction';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../../store/transactionSlice';
import { REDUX_SLICE_DATA_STATUS } from '../../utils/constants';
import './transactionHistory.css';

const TransactionHistory = () => {
    const dispatch = useDispatch();

    const transactions = useSelector(state => state.transactions);

    const [transactionHistory, setTransactionHistory] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [userAccountNumber, setUserAccountNumber] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        if (transactions.status === REDUX_SLICE_DATA_STATUS.IDLE) {
            dispatch(getTransactions());
        } else if (transactions.status === REDUX_SLICE_DATA_STATUS.SUCCEEDED) {
            setTransactionHistory(transactions.data);
            setFilteredTransactions(transactions.data);
            setUserAccountNumber(getAccountNumberFromToken());
        } else if (transactions.status === REDUX_SLICE_DATA_STATUS.FAILED) {
            console.error('Transactions history fetching failed: ' + transactions.error);
            toast.error('Transactions history fetching failed: ' + transactions.error);
        }
    }, [transactions]);

    const handleFilterChange = (e) => {
        const criteria = e.target.value;
        setFilterCriteria(criteria);
        applyFilter(criteria);
        setCurrentPage(1); // Reset pagination when filtering
    };

    const applyFilter = (criteria) => {
        let filtered = [...transactionHistory];
        if (criteria === 'Deposit') {
            filtered = filtered.filter(t => t.transactionType === 'CASH_DEPOSIT');
        } else if (criteria === 'Withdrawal') {
            filtered = filtered.filter(t => t.transactionType === 'CASH_WITHDRAWAL');
        } else if (criteria === 'Transfer') {
            filtered = filtered.filter(t => t.transactionType === 'CASH_TRANSFER');
        }
        setFilteredTransactions(filtered);
    };

    const getTransactionStatus = (transaction) => {
        let status = transaction.transactionType.slice(5).toLowerCase();
        if (status === 'transfer' && transaction.targetAccountNumber === userAccountNumber) {
            return 'Credit';
        }
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

    const formatDate = (date) =>
        new Date(date).toLocaleDateString('en-CA');

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <div className="coverparentspace">
            <div className="flex gap-5 flex-col">

                {transactionHistory.length !== 0 && (
                    <>
                        <TransactionChart transactions={transactionHistory} sourceAccountNumber={userAccountNumber} />
                        <div className="flex flex-col gap-5 md:flex-row space-y-4 md:space-y-0">
                            <div className="w-full">
                                <MonthlyTransactionChart transactions={transactionHistory} sourceAccountNumber={userAccountNumber} />
                            </div>
                            <div className="w-full">
                                <DailyTransactionPieChart transactions={transactionHistory} sourceAccountNumber={userAccountNumber} />
                            </div>
                        </div>
                    </>
                )}

                <div className="shadow-lg rounded-lg bg-white overflow-hidden px-6 py-4 card overflow-hidden">
                    <h4 className="text-lg font-semibold text-gray-800">Filter by Transaction Type</h4>
                    <div className="relative my-4 flex items-center">
                        <select
                            className="block w-full p-3 border border-gray-300 rounded-md shadow sm:text-sm"
                            value={filterCriteria}
                            onChange={handleFilterChange}
                        >
                            <option value="">All Transactions</option>
                            <option value="Deposit">Deposits</option>
                            <option value="Withdrawal">Withdrawals</option>
                            <option value="Transfer">Transfers/Credited</option>
                        </select>
                        <DownloadTransactions data={transactionHistory} />
                    </div>

                    <div className="w-full border border-gray-200 mb-4">
                        {currentTransactions.length > 0 ? (
                            <>
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full rounded-lg">
                                        <thead>
                                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b bg-gray-50">
                                                <th className="px-4 py-3">Transaction ID</th>
                                                <th className="px-4 py-3">Amount</th>
                                                <th className="px-4 py-3">Transaction Date</th>
                                                <th className="px-4 py-3">Transaction Type</th>
                                                <th className="px-4 py-3">Source Account</th>
                                                <th className="px-4 py-3">Target Account</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-300">
                                            {currentTransactions.map((t) => (
                                                <tr key={t.id} className="text-gray-900 text-center">
                                                    <td className="px-4 py-3">{t.id}</td>
                                                    <td className="px-4 py-3 font-semibold">{formatCurrency(t.amount)}</td>
                                                    <td className="px-4 py-3">{formatDate(t.transactionDate)}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1 font-semibold text-sm rounded-full">
                                                            {getTransactionStatus(t)}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{t.sourceAccountNumber}</td>
                                                    <td className="px-4 py-3">{t.targetAccountNumber}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Controls */}
                                <div className="flex justify-center mt-4 space-x-2">
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 bg-indigo-500 rounded disabled:opacity-50"
                                    >
                                        Prev
                                    </button>
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => handlePageChange(index + 1)}
                                            className={`px-3 py-1 rounded ${currentPage === index + 1
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-gray-300'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 bg-indigo-500 rounded disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center mt-4">
                                <p className="mb-4 text-2xl font-semibold text-gray-900">No Transaction History</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionHistory;
