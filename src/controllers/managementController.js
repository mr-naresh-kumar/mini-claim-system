const Claim = require('../models/Claim');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { updateClaimSchema } = require('../utils/validation');

// @desc    Update Claim Status (State Machine)
// @route   POST /api/v1/management/update-claim/:id
// @access  Private / Management
exports.updateClaimStatus = asyncHandler(async (req, res, next) => {
    const { error } = updateClaimSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { approval_status, remark } = req.body;

    let claim = await Claim.findById(req.params.id);

    if (!claim) {
        return next(new ErrorResponse(`Claim not found with id of ${req.params.id}`, 404));
    }

    // Advanced OPDSure state machine role checks could be placed here:
    // e.g. Verifier (designation 2) can only set status 2.
    // Manager (designation 3) can only set status 4.
    // Financer (designation 4) can only set status 8.
    
    // For MVP phase, we enforce the DB level change.
    claim.internal_status = approval_status;
    
    // In OPDSure, remarks are attached to claims usually in a sub-document array for timeline auditing.
    // Since our claim schema has `user_remark`, we might need a `management_remarks` field.
    // But for now, we just update the status as per the schema specification.

    await claim.save();

    res.status(200).json({
        success: true,
        message: "Claim status updated successfully",
        data: claim
    });
});
