const mongoose = require('mongoose');

customerRequestDetails = mongoose.model("customer_requests", {
    company_name: String,
    email: String,
    phone_number: Number,
    address: String,
    photos: [{ data: Buffer, contentType: String }]

})

customerDetails = mongoose.model("User_details", {
    company_name: String,
    name: String,
    email: {
        type: String,
        validate: {
            validator: (value) => {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
            },
            message: (props) => {
                return `${props.value} is invalid format`
            }
        } 
    },
    password: String,
    role: {
        type: String,
        default: 'customer'
    },
    authorize: {
        type: Boolean,
        default: false
    },
    file: {
        data: Buffer,
        contentType: String,
    }
})

module.exports = { customerRequestDetails, customerDetails }