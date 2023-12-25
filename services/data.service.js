const fs = require('fs');
const {customerRequestDetails, customerDetails} = require('../model/customer.model');

class dataService {
    addReqDetails(data) {
        const chkData = new customerRequestDetails(data);

        chkData.photos = data.files.map(file => ({
            data: fs.readFileSync(file.path),
            contentType: file.mimetype
        }))

        return chkData.save();
    }

    create(data) {
        const dataChk = new customerDetails(data);
        return dataChk.save();
    }

    deleteUser(data) {
        const userChk = new customerDetails(data);
        return userChk.findOneAndDelete(data);
    }

    updatePassword(data) {
        const passUpdt = new customerDetails(data);
        return passUpdt.findOneAndUpdate(data);
    }

    getByEmail(email) {
        return customerDetails.findOne({email});
    }
}

module.exports = new dataService();