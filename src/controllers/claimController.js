const Claim = require('../models/Claim');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { claimSchema } = require('../utils/validation');

//   Create new claim
//   POST /api/v1/claims
//   Private
exports.createClaim = asyncHandler(async (req, res, next) => {
    // Validate claim basic data
    const { error } = claimSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { claimType, amount } = req.body;

    // Check if receipts are uploaded
    if (!req.files || req.files.length === 0) {
        return next(new ErrorResponse('At least one receipt is required', 400));
    }

    // Business Rules for COMBINED
    if (claimType === 'COMBINED' && req.files.length < 2) {
        return next(new ErrorResponse('COMBINED claims require multiple receipts', 400));
    }

    const receipts = req.files.map(file => file.path);

    const claim = await Claim.create({
        employeeId: req.user.id,
        claimType,
        amount,
        receipts,
        status: 'PENDING'
    });

    res.status(201).json({
        success: true,
        data: claim
    });
});

//   Get all claims for logged in user
//   GET /api/v1/claims
//   Private
exports.getClaims = asyncHandler(async (req, res, next) => {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { employeeId: req.user.id };

    if (status) {
        query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const claims = await Claim.find(query)
        .sort('-createdAt')
        .skip(parseInt(skip))
        .limit(parseInt(limit));

    const total = await Claim.countDocuments(query);

    res.status(200).json({
        success: true,
        count: claims.length,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total
        },
        data: claims
    });
});
