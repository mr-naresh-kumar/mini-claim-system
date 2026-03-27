const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const corporateHrSchema = new mongoose.Schema({
    corporate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Corporate',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    status: {
        type: Number,
        required: true,
        default: 1 // 1: Active, 0: Inactive
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
    },
    country_code: {
        type: String
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
corporateHrSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
corporateHrSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: 4 }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Or your config
    });
};

// Match user entered password to hashed password in database
corporateHrSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('CorporateHr', corporateHrSchema);
