const mongoose = require("mongoose");

let verifyOTPSchema = mongoose.Schema({
    loginEmailForgotPassword : {
        type : String
    },
    loginEmailForgotPasswordOTP : {
        type : String
    }
}, {timestamps : true} );

verifyOTPSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });
const OTPInfo = mongoose.model("VerifyLoginOTP", verifyOTPSchema);

module.exports = OTPInfo;