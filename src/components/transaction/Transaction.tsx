import React from 'react';
import { jwtDecode } from 'jwt-decode';
import environment from '../../config/environment';
import TransactionHistory from '../transactionHistory/TransactionHistory';
import './transaction.css';

export const getAccountNumberFromToken = () => {
  const token = localStorage.getItem(environment.tokenName);
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub;
  }
  return null;
};

const Transaction = () => {
  return (
    <div className="flex flex-col justify-center items-center coverparentspace">
      <h2 className="my-6 text-2xl font-semibold text-gray-900">Transaction History</h2>
      <TransactionHistory />
    </div>
  );
};

export default Transaction;
