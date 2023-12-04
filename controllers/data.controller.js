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
        const em = req.body.email;
        const eMail = await dataService.getByEmail(em);
        console.log(eMail);

        if(!eMail){
            return res.send({message: 'user need to signup'})
        }

        if(eMail){
            const pass = req.body.password;
            const passMatch = await bcryptJs.compare(pass, eMail.password);
            if(!passMatch){
                return res.send({status: 'failed', message: 'Incorrect password'});
            }else{
                const token = jwt.sign({email: eMail.email, name: eMail.username}, secretKey);
                res.send({token: token, message: 'login successfully'});
            }
        }
    }
}

module.exports = new dataController();