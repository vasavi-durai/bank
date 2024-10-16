var express= require('express');
var router = express.Router();

var transcontroller = require('../controllers/transactioncontroller');
router.post('/transaction', transcontroller.transcontroller);
module.exports = router;
