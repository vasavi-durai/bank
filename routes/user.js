var express = require('express');
var router = express.Router();

const  {getByaccNo} = require('../controllers/usercontroller');

router.get('/userdata', getByaccNo );
module.exports = router;
