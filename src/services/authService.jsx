import axiosService from './axiosService';
import { jwtDecode } from 'jwt-decode';
import environment from '../config/environment';

const baseUrl = environment.apiUrl;
const authTokenName = environment.tokenName;

const AuthService = {
    // User registration
    registerUser: async (data) => {
        const response = await axiosService.post(`/users/register`, data);
        return response.data;
    },

    // Fetch user details
    getUserDetails: async () => {
        const response = await axiosService.get(`/dashboard/user`);
        return response.data;
    },

    // Update user profile
    updateUserProfile: async (payload) => {
        const response = await axiosService.post(`/users/update`, payload);
        return response.data;
    },

    // Generate OTP
    generateOTP: async (identifier) => {
        const response = await axiosService.post(`/users/generate-otp`, { identifier });
        return response.data;
    },

    // Verify OTP
    verifyOTP: async (otpVerificationRequest) => {
        const response = await axiosService.post(`/users/verify-otp`, otpVerificationRequest);
        return response.data;
    },

    // Login user
    login: async (identifier, password) => {
        const response = await axiosService.post(`/users/login`, { identifier, password });
        return response.data;
    },

    // Check if user is logged in
    isLoggedIn: () => {
        const token = localStorage.getItem(authTokenName);
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                if (decodedToken?.exp && decodedToken.exp * 1000 > Date.now()) {
                    return true;
                }
            } catch (error) {
                console.error('Error decoding JWT token:', error);
            }
        }
        return false;
    },

    // Logout user
    logOutUser: async () => {
        const response = await axiosService.get(`/users/logout`);
        return response.data;
    },

    // Password reset - send OTP
    sendOtpForPasswordReset: async (identifier) => {
        const response = await axiosService.post(`/auth/password-reset/send-otp`, { identifier });
        return response.data;
    },

    // Password reset - verify OTP
    verifyOtpForPasswordReset: async (identifier, otp) => {
        const response = await axiosService.post(`/auth/password-reset/verify-otp`, { identifier, otp });
        return response.data;
    },

    // Reset password
    resetPassword: async (identifier, resetToken, newPassword) => {
        const response = await axiosService.post(`/auth/password-reset`, {
            identifier,
            resetToken,
            newPassword,
        });
        return response.data;
    }
};

export default AuthService;
