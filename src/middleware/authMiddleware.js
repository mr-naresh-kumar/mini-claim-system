const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');
const CorporateHr = require('../models/CorporateHr');
const ManagementUser = require('../models/ManagementUser');
const { ROLES } = require('../utils/constants');

const verifyToken = (req) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) throw new ErrorResponse('Not authorized to access this route', 401);
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch(err) {
        throw new ErrorResponse('Not authorized to access this route', 401);
    }
};

exports.AdminAuth = asyncHandler(async (req, res, next) => {
    const decoded = verifyToken(req);
    if (decoded.role !== ROLES.ADMIN) {
        return next(new ErrorResponse('Not authorized as Admin', 403));
    }
    req.user = await ManagementUser.findById(decoded.id);
    if (!req.user) return next(new ErrorResponse('Admin not found', 404));
    next();
});

exports.ManagementUsersAuth = asyncHandler(async (req, res, next) => {
    const decoded = verifyToken(req);
    if (decoded.role !== ROLES.ADMIN && decoded.role !== ROLES.MANAGEMENT_USER) {
        return next(new ErrorResponse('Not authorized as Management', 403));
    }
    req.user = await ManagementUser.findById(decoded.id);
    if (!req.user) return next(new ErrorResponse('Management user not found', 404));
    next();
});

exports.HRAuth = asyncHandler(async (req, res, next) => {
    const decoded = verifyToken(req);
    if (decoded.role !== ROLES.HR_USER) {
        return next(new ErrorResponse('Not authorized as HR', 403));
    }
    req.user = await CorporateHr.findById(decoded.id);
    if (!req.user) return next(new ErrorResponse('HR user not found', 404));
    next();
});

exports.UserAuth = asyncHandler(async (req, res, next) => {
    const decoded = verifyToken(req);
    // Standard Employees are role 3 (GENERAL_USER) according to constants/schema
    if (decoded.role !== ROLES.GENERAL_USER) {
        return next(new ErrorResponse('Not authorized as User', 403));
    }
    req.user = await User.findById(decoded.id);
    if (!req.user) return next(new ErrorResponse('User not found', 404));
    next();
});

// Generic protect for backwards compatibility during migration
exports.protect = asyncHandler(async (req, res, next) => {
    const decoded = verifyToken(req);
    req.user = { id: decoded.id, role: decoded.role }; 
    next();
});
