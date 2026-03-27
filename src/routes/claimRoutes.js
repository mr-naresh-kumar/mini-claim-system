const express = require('express');
const { createClaim, getClaims } = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.use(protect); // All routes in this router are protected

router.post('/', upload.array('receipts', 10), createClaim);
router.get('/', getClaims);

module.exports = router;
