module.exports = {
    // Roles
    ROLES: {
        ADMIN: 1,
        MANAGEMENT_USER: 2,
        GENERAL_USER: 3,
        HR_USER: 4
    },
    
    // Genders
    GENDERS: {
        MALE: 1,
        FEMALE: 2,
        OTHER: 3
    },
    
    // Claim Types
    CLAIM_TYPES: {
        OPD: 0,
        PHARMACY: 1,
        LAB_TEST: 2,
        COMBINED_PHARMACY_LAB: 3
    },

    // Claim Internal Status
    CLAIM_STATUS: {
        NO_ACTION: 0,
        APPROVED_BY_VERIFIER: 2,
        APPROVED_BY_MANAGER: 4,
        APPROVED_FINAL: 8,
        REJECTED: 5,
        CLARIFICATION: 6,
        INVALID: 7
    },

    // Password regex (1 Uppercase, 1 Number, 1 Special Char, Min 8 length)
    PASSWORD_VALIDATION_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_])[A-Za-z\d@$!%*?&#_]{8,}$/
};
