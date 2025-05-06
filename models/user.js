const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique:true
    },
    contact: {
        type: String,
        required: [true, 'contact is required']

    },
    password: {
        type: String,
        required: [true, 'password is required'],
    },
    role: {
        type: Number,
        default: 0,
    },
},
    { timestamps: true }
);
const user = mongoose.model("User", userSchema);
module.exports = user;