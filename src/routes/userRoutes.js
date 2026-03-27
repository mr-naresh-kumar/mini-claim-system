const express = require('express');
const { addMember, addClaim } = require('../controllers/userController');
const { UserAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(UserAuth); // Protect all user routes

router.post('/add-member', addMember);

// Multer configured for fee_receipt and prescription arrays
router.post('/add-claim', upload.fields([
    { name: 'fee_receipt', maxCount: 10 },
    { name: 'prescription', maxCount: 10 }
]), addClaim);

module.exports = router;
