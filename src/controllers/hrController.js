const CorporateHr = require('../models/CorporateHr');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { hrLoginSchema, addEmployeeSchema } = require('../utils/validation');

// @desc    Login HR
// @route   POST /api/v1/hr/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { error } = hrLoginSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    const { email, password } = req.body;

    const hr = await CorporateHr.findOne({ email }).select('+password');
    if (!hr) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await hr.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    if (hr.status !== 1) {
        return next(new ErrorResponse('Account is inactive', 403));
    }

    res.status(200).json({
        success: true,
        token: hr.getSignedJwtToken(),
        user_id: hr._id,
        designation: 'HR'
    });
});

// @desc    Add Single Employee
// @route   POST /api/v1/hr/corpoEmp
// @access  Private / HR
exports.createCorporateEmployee = asyncHandler(async (req, res, next) => {
    const { error } = addEmployeeSchema.validate(req.body);
    if (error) {
        return next(new ErrorResponse(error.details[0].message, 400));
    }

    // HR can only add employees to their own corporate entity
    req.body.corporate = req.user.corporate;
    req.body.subscriber_type = 2; // Member

    const employee = await User.create(req.body);

    res.status(200).json({
        success: true,
        message: "Employee added successfully",
        data: employee
    });
});
