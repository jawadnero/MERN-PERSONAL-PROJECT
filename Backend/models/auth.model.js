const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    otp: {
        type: String,
        default: null,
    },

    otpExpires: {
        type: Date,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false
    }

});


const userModel = mongoose.model("User", userSchema);

module.exports = userModel;