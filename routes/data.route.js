var express = require('express');
var router = express.Router();
var dataCntrl = require('../controllers/data.controller');

router.post('/sendRequest', dataCntrl.newCustomerRequest);
router.post('/login', dataCntrl.login);
router.get('/welcomePage', (req, res)=>{
    res.send({message: 'intial page'});
})

module.exports = router;