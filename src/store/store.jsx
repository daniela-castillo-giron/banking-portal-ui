// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import accountReducer from './accountSlice';
import transactionsReducer from './transactionSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        account: accountReducer,
        transactions: transactionsReducer,
    },
});

export default store;
