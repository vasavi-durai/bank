var express = require('express');
var router = express.Router();
var {getUserByAccno,getUserByUsername} =require('../controller/transactioncontroller');

router.get('/', getUserByAccno);

module.exports = router;