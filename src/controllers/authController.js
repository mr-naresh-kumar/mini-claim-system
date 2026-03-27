const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { registerSchema, loginSchema } = require('../utils/validation');

//    Register user
//  POST /api/v1/auth/register
//   Public
exports.register = asyncHandler(async (req, res, next) => {
    // Validate request
    const { error } = registerSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { name, email, password, employeeId, corporate } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new ErrorResponse('User already exists', 400));
    }

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        employeeId,
        corporate
    });

    sendTokenResponse(user, 201, res);
});

//   Login user
//   POST /api/v1/auth/login
//   Public
exports.login = asyncHandler(async (req, res, next) => {
    // Validate request
    const { error } = loginSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res);
});

//   Get current logged in user
//   GET /api/v1/auth/me
//   Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token
    });
};
