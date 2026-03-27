const Family = require('../models/Family');
const Claim = require('../models/Claim');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { addFamilySchema, raiseClaimSchema } = require('../utils/validation');

// @desc    Add Family Member
// @route   POST /api/v1/user/add-member
// @access  Private / User
exports.addMember = asyncHandler(async (req, res, next) => {
    const { error } = addFamilySchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    // Check member limits (Max 10)
    const count = await Family.countDocuments({ user_id: req.user.id });
    if (count >= 10) {
        return next(new ErrorResponse('Maximum of 10 family members allowed', 400));
    }

    req.body.user_id = req.user.id;

    const familyMember = await Family.create(req.body);

    res.status(200).json({
        success: true,
        message: "Member added successfully",
        data: familyMember
    });
});

// @desc    Raise a Claim
// @route   POST /api/v1/user/add-claim
// @access  Private / User
exports.addClaim = asyncHandler(async (req, res, next) => {
    const { error } = raiseClaimSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const claimData = { ...req.body, user_id: req.user.id };

    // Handle files via multer fields
    if (req.files) {
        if (req.files.fee_receipt) {
            claimData.fee_receipt = req.files.fee_receipt.map(f => f.path);
        }
        if (req.files.prescription) {
            claimData.prescription = req.files.prescription.map(f => f.path);
        }
    }

    if (!claimData.fee_receipt || claimData.fee_receipt.length === 0) {
        return next(new ErrorResponse('At least one fee_receipt is required', 400));
    }

    // Set default internal status to NO_ACTION (0)
    claimData.internal_status = 0;

    const claim = await Claim.create(claimData);

    res.status(201).json({
        success: true,
        message: "Claim raised successfully",
        data: claim
    });
});
