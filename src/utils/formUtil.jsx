// Password mismatch validator for custom use in React forms
export function passwordMismatch(values, controlName, matchingControlName) {
    const errors = {};
    if (values[controlName] !== values[matchingControlName]) {
        errors[matchingControlName] = 'Passwords do not match';
    }
    return errors;
}

// Strong password regex: at least 1 uppercase, 1 lowercase, 1 number, min 8 characters
export const StrongPasswordRegx = /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;
