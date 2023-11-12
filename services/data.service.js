const dataModel = require('../model/data.model');

class dataService {
    create(data) {
        const dataChk = new dataModel(data);
        return dataChk.save();
    }

    getByEmail(email) {
        return dataModel.findOne({email});
    }
}

module.exports = new dataService();