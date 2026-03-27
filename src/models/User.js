const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    corporate: {
        type: mongoose.Schema.ObjectId,
        ref: 'Corporate',
        required: true
    },
    employeeId: {
        type: String,
        required: [true, 'Please add an employee identifier']
    },
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
    subscriber_type: {
        type: Number,
        required: true,
        enum: [2, 3] // As per DB Arch
    },
    designation: {
        type: String,
        required: true
    },
    bank_name: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: Number,
        required: true,
        enum: [1, 2, 3] // M, F, O
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 1
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: 'Plan' // Future Plan Model
    },
    membership: {
        type: Number
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id, role: 3 }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

userSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
