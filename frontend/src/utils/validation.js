// Validation utilities for form inputs

/**
 * Validates if a field is required and not empty
 * @param {string} value - The value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'Field') => {
    if (!value || value.toString().trim() === '') {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Validates minimum length for a string
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum required length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
    if (!value) return null; // Let validateRequired handle empty values

    if (value.toString().length < minLength) {
        return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
};

/**
 * Validates maximum length for a string
 * @param {string} value - The value to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
    if (!value) return null; // Let validateRequired handle empty values

    if (value.toString().length > maxLength) {
        return `${fieldName} cannot exceed ${maxLength} characters`;
    }
    return null;
};

/**
 * Validates email format using regex
 * @param {string} email - The email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
    if (!email) return null; // Let validateRequired handle empty values

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
    if (!password) return null; // Let validateRequired handle empty values

    if (password.length < 6) {
        return 'Password must be at least 6 characters long';
    }

    // Optional: Add more password requirements
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumbers = /\d/.test(password);
    // const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return null;
};

/**
 * Validates that two passwords match
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) return null; // Let validateRequired handle empty values

    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
};

/**
 * Validates a URL format
 * @param {string} url - The URL to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUrl = (url) => {
    if (!url) return null; // Let validateRequired handle empty values

    try {
        new URL(url);
        return null;
    } catch {
        return 'Please enter a valid URL';
    }
};

/**
 * Validates that a value is within a numeric range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} fieldName - Name of the field for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRange = (value, min, max, fieldName = 'Value') => {
    if (value === null || value === undefined || value === '') return null;

    const numValue = Number(value);
    if (isNaN(numValue)) {
        return `${fieldName} must be a valid number`;
    }

    if (numValue < min || numValue > max) {
        return `${fieldName} must be between ${min} and ${max}`;
    }
    return null;
};

/**
 * Combines multiple validation functions for a single field
 * @param {string} value - The value to validate
 * @param {Array} validators - Array of validation functions
 * @returns {string|null} First error message found or null if all pass
 */
export const combineValidators = (value, validators) => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};

/**
 * Validates an entire form object
 * @param {Object} formData - Object containing form field values
 * @param {Object} validationRules - Object mapping field names to validator arrays
 * @returns {Object} Object containing any validation errors
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    Object.keys(validationRules).forEach(fieldName => {
        const value = formData[fieldName];
        const validators = validationRules[fieldName];
        const error = combineValidators(value, validators);

        if (error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};

// Common validation rule sets for reuse
export const commonRules = {
    email: [
        (value) => validateRequired(value, 'Email'),
        validateEmail
    ],
    password: [
        (value) => validateRequired(value, 'Password'),
        validatePassword
    ],
    name: [
        (value) => validateRequired(value, 'Name'),
        (value) => validateMinLength(value, 2, 'Name'),
        (value) => validateMaxLength(value, 50, 'Name')
    ],
    title: [
        (value) => validateRequired(value, 'Title'),
        (value) => validateMinLength(value, 3, 'Title'),
        (value) => validateMaxLength(value, 100, 'Title')
    ],
    description: [
        (value) => validateMaxLength(value, 500, 'Description')
    ],
    content: [
        (value) => validateRequired(value, 'Content'),
        (value) => validateMinLength(value, 10, 'Content'),
        (value) => validateMaxLength(value, 2000, 'Content')
    ]
};