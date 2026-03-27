const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const managementUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
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
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 8,
        select: false
    },
    designation: {
        type: Number,
        required: true,
        enum: [1, 2, 3, 4] // 1: Admin, 2: Verifier, 3: Manager, 4: Financer
    }
}, {
    timestamps: true
});

// Encrypt password using bcrypt
managementUserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
managementUserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: this.designation === 1 ? 1 : 2 }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Match user entered password
managementUserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('ManagementUser', managementUserSchema);
