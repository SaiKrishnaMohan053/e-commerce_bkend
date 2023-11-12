const mongoose = require('mongoose');

module.exports = mongoose.model("User_details", {
    username: {
        type: String,
    },
    password: {
        type: String
    },
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
    }
})