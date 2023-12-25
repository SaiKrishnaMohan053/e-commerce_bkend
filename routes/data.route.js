const express = require('express');
const router = express.Router();
const multer = require('multer');
const dataCntrl = require('../controllers/data.controller');

const upload = multer({ dest: 'uploads/' });

router.post('/sendRequest', upload.fields([{name: 'abc_lic_photo', maxCount: 1}, {name: 'sales_tax_photo', maxCount: 1}]), dataCntrl.newCustomerRequest);
router.post('/login', dataCntrl.login);
router.get('/welcomePage', (req, res)=>{
    res.send({message: 'intial page'});
})

module.exports = router;