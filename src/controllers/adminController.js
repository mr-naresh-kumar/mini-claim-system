const Corporate = require('../models/Corporate');
const CorporateHr = require('../models/CorporateHr');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { createCorporateSchema, createHrSchema, addEmployeeSchema } = require('../utils/validation');

// @desc    Create Corporate Entity
// @route   POST /api/v1/admin/corporation
// @access  Private / Admin
exports.createCorporation = asyncHandler(async (req, res, next) => {
    const { error } = createCorporateSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const corporate = await Corporate.create(req.body);

    res.status(200).json({
        success: true,
        message: "API executed successfully",
        data: corporate
    });
});

// @desc    Create Corporate HR Account
// @route   POST /api/v1/admin/corporateHr
// @access  Private / Admin
exports.createCorporateHr = asyncHandler(async (req, res, next) => {
    const { error } = createHrSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    // Ensure corporate exists
    const corporate = await Corporate.findById(req.body.corporate);
    if (!corporate) {
        return next(new ErrorResponse(`Corporate not found with id of ${req.body.corporate}`, 404));
    }

    // Check email uniqueness
    const existingHr = await CorporateHr.findOne({ email: req.body.email });
    if (existingHr) {
        return next(new ErrorResponse('HR with that email already exists', 400));
    }

    const hr = await CorporateHr.create(req.body);

    res.status(200).json({
        success: true,
        message: "HR Account created successfully",
        data: hr
    });
});

// @desc    Add Single Employee (Admin Scope)
// @route   POST /api/v1/admin/corpoEmp
// @access  Private / Admin
exports.createCorporateEmployee = asyncHandler(async (req, res, next) => {
    // Basic implementation that allows Admin to add employees 
    // Usually Admin needs a generic 'corporate' linked in request if doing this,
    // assuming it is provided or inferred. Since schema has corporate, it must be added.
    const { error } = addEmployeeSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    if (!req.body.corporate) {
        return next(new ErrorResponse("Admin must specify 'corporate' id to add an employee", 400));
    }

    const employee = await User.create({
        ...req.body,
        subscriber_type: 2 // Assuming employees are type 2/3
    });

    res.status(200).json({
        success: true,
        message: "Employee added successfully",
        data: employee
    });
});
