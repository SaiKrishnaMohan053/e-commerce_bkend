var express = require('express');
var router = express.Router();
var dataCntrl = require('../controllers/data.controller');

router.post('/signup', dataCntrl.saveData);
router.post('/login', dataCntrl.login);

module.exports = router;