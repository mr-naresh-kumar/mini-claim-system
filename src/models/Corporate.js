const mongoose = require('mongoose');

const corporateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a corporate name']
    },
    status: {
        type: Number,
        default: 1 // 1: Active, 0: Inactive
    },
    address: {
        type: String,
        required: [true, 'Please provide an address']
    },
    state: {
        type: Number,
        required: [true, 'Please provide a state ID (0-35)'],
        min: 0,
        max: 35
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number'],
        minlength: 10,
        maxlength: 13
    },
    country_code: {
        type: String,
        required: [true, 'Please provide a country code']
    },
    contact_person: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Corporate', corporateSchema);
