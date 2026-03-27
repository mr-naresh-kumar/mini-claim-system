const express = require('express');
const { updateClaimStatus } = require('../controllers/managementController');
const { ManagementUsersAuth, AdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(ManagementUsersAuth);

router.post('/update-claim/:id', updateClaimStatus);

module.exports = router;
