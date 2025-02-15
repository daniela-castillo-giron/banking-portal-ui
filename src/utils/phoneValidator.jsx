import { isValidPhoneNumber } from 'libphonenumber-js';

/**
 * Validates the phone number based on country code.
 * @param {string} phoneNumber - The phone number input value.
 * @param {string} countryCode - The country code input value (ISO 3166-1 alpha-2).
 * @returns {string|null} - Returns error message if invalid, otherwise null.
 */
export function validatePhoneNumber(phoneNumber, countryCode) {
    if (isValidPhoneNumber(phoneNumber, countryCode)) {
        return null;
    }
    return 'Invalid phone number';
}
