const express = require('express');
const { login, createCorporateEmployee } = require('../controllers/hrController');
const { HRAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', login);
router.post('/corpoEmp', HRAuth, createCorporateEmployee);

module.exports = router;
