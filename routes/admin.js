const express = require('express');
const router = express.Router();
const admincontroller = require('../controllers/admincontroller');
router.post('/adtrans', admincontroller.admintranscontroller);
router.get('/adhistory', admincontroller.adminhistorycontroller);

module.exports = router;
