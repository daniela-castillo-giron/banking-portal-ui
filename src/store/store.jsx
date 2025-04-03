// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import accountReducer from './accountSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        account: accountReducer,
    },
});

export default store;
