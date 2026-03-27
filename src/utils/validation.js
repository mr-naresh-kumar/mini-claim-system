const Joi = require('joi');
const { PASSWORD_VALIDATION_REGEX } = require('./constants');

const createCorporateSchema = Joi.object({
    name: Joi.string().required(),
    status: Joi.number().valid(0, 1).default(1),
    address: Joi.string().required(),
    state: Joi.number().min(0).max(35).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(13).required(),
    country_code: Joi.string().required(),
    contact_person: Joi.string().optional()
});

const createHrSchema = Joi.object({
    corporate: Joi.string().required(), // ObjectId
    name: Joi.string().required(),
    status: Joi.number().valid(0, 1).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(PASSWORD_VALIDATION_REGEX).required()
        .messages({ 'string.pattern.base': 'Password must be min 8 chars, 1 uppercase, 1 number, 1 special char' }),
    country_code: Joi.string().optional()
});

const hrLoginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const addEmployeeSchema = Joi.object({
    employeeId: Joi.string().required(),
    name: Joi.string().max(150).required(),
    designation: Joi.string().required(),
    bank_name: Joi.string().required(),
    department: Joi.string().required(),
    address: Joi.string().max(500).required(),
    dob: Joi.date().iso().less('now').required(),
    gender: Joi.number().valid(1, 2, 3).required(),
    phone: Joi.string().min(10).max(13).required(),
    email: Joi.string().email().required(),
    status: Joi.number().valid(0, 1).required(),
    plan: Joi.string().required(), // ObjectId
    membership: Joi.number().required()
});

const addFamilySchema = Joi.object({
    name: Joi.string().required(),
    relation: Joi.number().min(0).max(10).required(),
    dob: Joi.date().iso().less('now').required(),
    gender: Joi.number().valid(1, 2, 3).required(),
    phone: Joi.number().required(),
    country_code: Joi.string().required(),
    address: Joi.string().required()
});

const raiseClaimSchema = Joi.object({
    member_id: Joi.string().required(), // ObjectId
    opd_date: Joi.date().iso().required(),
    doc_name: Joi.string().required(),
    doc_registration: Joi.string().min(4).max(20).required(),
    pincode: Joi.string().length(6).required(),
    doc_address: Joi.string().max(500).required(),
    city: Joi.string().required(),
    diagonosis_detail: Joi.string().required(),
    claim_combination: Joi.number().valid(1, 2).required(),
    doctor_fee: Joi.number().optional(),
    claimable_doctor_fee: Joi.number().optional(),
    bill_amount: Joi.number().optional(),
    claimable_amount: Joi.number().optional(),
    hospital: Joi.string().required(),
    pharmacy_fee: Joi.number().when('claim_combination', { is: 1, then: Joi.required() }),
    lab_test_fee: Joi.number().when('claim_combination', { is: 1, then: Joi.required() }),
    user_remark: Joi.string().max(1000).optional()
}).unknown(true);

const updateClaimSchema = Joi.object({
    approval_status: Joi.number().valid(0, 2, 4, 8, 5, 6, 7).required(),
    remark: Joi.string().when('approval_status', { is: Joi.valid(5, 6, 7), then: Joi.required() })
});

module.exports = {
    createCorporateSchema,
    createHrSchema,
    hrLoginSchema,
    addEmployeeSchema,
    addFamilySchema,
    raiseClaimSchema,
    updateClaimSchema
};
