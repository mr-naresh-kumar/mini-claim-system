const mongoose = require('mongoose');

const familySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a member name']
    },
    relation: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    dob: {
        type: String,
        required: [true, 'Please add Date of Birth']
    },
    gender: {
        type: Number,
        required: true,
        enum: [1, 2, 3]
    },
    phone: {
        type: Number,
        required: [true, 'Please add phone number']
    },
    country_code: {
        type: String,
        required: [true, 'Please add country code']
    },
    address: {
        type: String,
        required: [true, 'Please add address']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Family', familySchema);
