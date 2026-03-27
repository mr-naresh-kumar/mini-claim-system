const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    member_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Family',
        required: true
    },
    opd_date: {
        type: Date,
        required: true
    },
    doc_name: {
        type: String,
        required: true
    },
    doc_registration: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    doc_address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    diagonosis_detail: {
        type: String,
        required: true
    },
    claim_combination: {
        type: Number,
        required: true,
        enum: [1, 2] // 1: Separate, 2: Combined
    },
    doctor_fee: {
        type: Number,
        default: 0
    },
    claimable_doctor_fee: {
        type: Number,
        default: 0
    },
    bill_amount: {
        type: Number,
        default: 0
    },
    claimable_amount: {
        type: Number,
        default: 0
    },
    hospital: {
        type: String,
        required: true
    },
    fee_receipt: {
        type: [String]
    },
    prescription: {
        type: [String]
    },
    pharmacy_fee: {
        type: Number,
        default: 0
    },
    lab_test_fee: {
        type: Number,
        default: 0
    },
    user_remark: {
        type: String
    },
    internal_status: {
        type: Number,
        default: 0,
        enum: [0, 2, 4, 8, 5, 6, 7] 
        /*
          0: NO_ACTION
          2: APPROVED_BY_VERIFIER
          4: APPROVED_BY_MANAGER
          8: APPROVED (Final)
          5: REJECTED
          6: CLARIFICATION
          7: INVALID
        */
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Claim', claimSchema);
