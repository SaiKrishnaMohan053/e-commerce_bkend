const mongoose = require('mongoose');

adminDetails = mongoose.model("admin_details", {
    name: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String
    },
    role: {
        type: String,
        default: 'admin'
    }
})

module.exports = { adminDetails }