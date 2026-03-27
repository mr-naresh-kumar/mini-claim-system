const express = require('express');
const { createCorporation, createCorporateHr, createCorporateEmployee } = require('../controllers/adminController');
const { AdminAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(AdminAuth); // All admin routes are protected

router.post('/corporation', createCorporation);
router.post('/corporateHr', createCorporateHr);
router.post('/corpoEmp', createCorporateEmployee);

module.exports = router;
