const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dataService = require('../services/data.service');

const secretKey = 'this-is-ecommerce-website-mobile';

class dataController {
    async saveData(req,res) {
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
    }

    async login(req, res){
        const eMail = await dataService.getByEmail(req.body.email);
        if(!eMail){
            res.send({status: 'Signup'});
        }else if(eMail){
            const pass = req.body.password;
            const passMatch = await bcryptJs.compare(pass, eMail.password);
            if(!passMatch){
                res.send({status: 'failed', message: 'Incorrect password'});
            }else{
                const token = jwt.sign({email: eMail.email}, secretKey);
                res.send({token});
            }
        }
    }
}

module.exports = new dataController();