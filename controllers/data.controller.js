const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dataService = require('../services/data.service');
const { adminDetails } = require('../model/admin.model');

const secretKey = 'this-is-ecommerce-website-mobile';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_email@gmail.com',
      pass: 'your_email_password',
    },
});

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

const otpMap = new Map();

class dataController {
    async newCustomerRequest(req,res) {
        const {company_name, email, phone_number, address, federal_id} = req.body;

        const chkMail = await dataService.getByEmail(email);
        if(chkMail) {
            return res.send({message: 'email already exsists'});
        }

        const abcLicPhoto = { data: req.files['abc_lic_photo'][0].buffer, contentType: req.files['abc_lic_photo'][0].mimetype }
        const salesTaxPhoto = { data: req.files['sales_tax_photo'][0].buffer, contentType: req.files['sales_tax_photo'][0].mimetype }
      

        await dataService.addReqDetails({
            company_name: company_name, 
            email: email, 
            phone_number: phone_number, 
            address: address, 
            abc_lic_photo: abcLicPhoto, 
            sales_tax_photo: salesTaxPhoto,
            federal_id: federal_id
        });
        
        res.send({status: 'successfull', message: 'request sent successfully'});
    }

    async newCustomerReqHandling(req,res) {
        const { message, email } = req.body;

        if(message == 'accept') {
            const mail = await dataService.getByEmail(email);
            mail.password = mail.username;
            await dataService.create({ company_name: mail.company_name, name: mail.name, email: mail.email, password: mail.password, role: mail.role, file: mail.file });
        } else if(message == 'decline') {
            await dataService.deleteUser(email);
        }
    }

    async sendOtp(req,res) {
        const { email } = req.body;

        const otp = generateOTP();

        const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes in milliseconds
        otpMap.set(email, { otp, otpExpiry });

        const mailOptions = {
            from: 'your_email@gmail.com',
            to: email,
            subject: 'OTP for Verification',
            text: `Your OTP is: ${otp}. OTP expires in 5 minutes.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Error sending email:', error);
              res.status(500).send('Internal Server Error');
            } else {
              console.log('Email sent:', info.response);
              res.send('OTP sent successfully.');
            }
        });
    }

    async verifyOtp(req,res) {
        const { email, otp } = req.body;

        const storedOTP = otpMap.get(email);

        if (storedOTP && storedOTP.otp === otp && storedOTP.otpExpiry > Date.now()) {
            res.send({message: 'OTP is valid.', email: email});
        } else {
            res.status(400).send('Invalid or expired OTP.');
        }
    }

    async updatePassword(req,res) {
        const { email, password } = req.body;

        await dataService.updatePassword({email: email, password: password});
    }


    /*async saveData(req,res) {
        try{
            const eMail = req.body.email;
            const mail = await dataService.getByEmail(eMail);
            if(mail){
                res.send({status: 'email already exsists'});
            }else{
                const pass = req.body.password;
                
                const hashedpassword = await new Promise((resolve, reject) => {
                    bcryptJs.hash(pass, 10, (err, hashed) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hashed);
                        }
                    });
                })
                await dataService.create({username: req.body.username, password: hashedpassword, email: req.body.email});
                res.send({status: 'User registered successfully'});
            }
        }catch(err) {
            res.send({status: 'failed', message:err.message});
        }
    }*/

    async login(req, res){
        const em = req.body.email;
        const eMail = await dataService.getByEmail(em);
        console.log(eMail);

        if(!eMail){
            return res.send({message: 'user need to signup'})
        }

        const pass = req.body.password;
        const passMatch = await bcryptJs.compare(pass, eMail.password);
        if(!passMatch){
            return res.send({status: 'failed', message: 'Incorrect password'});
        }

        if(eMail.role == 'admin') {
            const adminMoodel = new adminDetails(eMail)
            const adminToken = jwt.sign({email: eMail.email, name: eMail.username, role: eMail.role}, secretKey);
            res.send({token: adminToken, message: 'admin login successfull'});
        } else {
            const customerToken = jwt.sign({email: eMail.email, name: eMail.username, role: eMail.role}, secretKey);
            res.send({token: customerToken, message: 'customer login successfull'});
        }
    }
}

module.exports = new dataController();