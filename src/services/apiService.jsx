import axiosService from '../services/axiosService';
import environment from '../config/environment';

const baseUrl = environment.apiUrl;

/**
 * API Service for handling account-related requests.
 */
const ApiService = {
    // Check if PIN is created
    checkPinCreated: async () => {
        try {
            const response = await axiosService.get(`/account/pin/check`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Create a new PIN
    createPin: async (pin, password) => {
        try {
            const response = await axiosService.post(`/account/pin/create`, { pin, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Update PIN
    updatePin: async (oldPin, newPin, password) => {
        try {
            const response = await axiosService.post(`/account/pin/update`, { oldPin, newPin, password });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Withdraw money
    withdraw: async (amount, pin) => {
        try {
            const response = await axiosService.post(`/account/withdraw`, { amount, pin });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Deposit money
    deposit: async (amount, pin) => {
        try {
            const response = await axiosService.post(`/account/deposit`, { amount, pin });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Fund transfer
    fundTransfer: async (amount, pin, targetAccountNumber) => {
        try {
            const response = await axiosService.post(`/account/fund-transfer`, { amount, pin, targetAccountNumber });
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Get all transactions
    getTransactions: async () => {
        try {
            const response = await axiosService.get(`/account/transactions`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    },

    // Get account details
    getAccountDetails: async () => {
        try {
            const response = await axiosService.get(`/dashboard/account`);
            return response.data;
        } catch (error) {
            throw error.response ? error.response.data : error;
        }
    }
};

export default ApiService;
