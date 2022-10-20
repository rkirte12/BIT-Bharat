const cloudinary = require("cloudinary").v2;
const userDB = require("../../models/userSignUpModel")
const otpDB = require("../../models/otp")
const otp = require("otp-generator")
const bcrypt = require("bcrypt")
require("../../helper/util")
const multer = require("multer")
const storage = multer.memoryStorage()
const uploads = multer({storage})
const Jio = require("joi");
const nodemailer = require("nodemailer");
const validator = require("email-validator");


const { sendMailOTP, getOTP } = require("../../helper/util");
const { generate } = require("otp-generator");
const { memoryStorage } = require("multer");
const { image } = require("../../util/cloudinary");

var secretKey = "Rahul";
var otpJWT;
var resendotpJWT;



//vaibhav cloudinaryy
cloudinary.config({
    cloud_name: "dq8gcu8ry",
    api_key: "387876933631833",
    api_secret: "jUpC-K9w_474ceebI96LUsU6Fs4",
    secure: true,
});

const userSignup = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        address,
        city,
        country,
        zipCode,
        dateOfBirth,
        gender,
        mobileNumber,
        pnWithoutCountryCode,
        previlage,
        state,
        message,
    } = req.body;
    console.log(req.body);
    if (
        firstName &&
        lastName &&
        email &&
        password &&
        address &&
        city &&
        country &&
        zipCode &&
        dateOfBirth &&
        mobileNumber &&
        state &&
        pnWithoutCountryCode &&
        previlage &&
        message

    ) {
        console.log("data is validate");
        if (validator.validate(email)) {
            console.log("valid email");
            let user = await userDB.findOne({ email: email });
            console.log(user);
            if (user) {
                return res
                    .status(403)
                    .send({
                        status: 205,
                        responseMessage: "Email is already exists",
                    });
            } else {
                console.log("email not available");
                let salt = await bcrypt.genSalt(10);
                let hashPass = await bcrypt.hash(password, salt);
                let data = new userDB({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: hashPass,
                    address: address,
                    city: city,
                    country: country,
                    zipCode: zipCode,
                    dateOfBirth: dateOfBirth,
                    gender: gender,
                    mobileNumber: mobileNumber,
                    state: state,
                    pnWithoutCountryCode: pnWithoutCountryCode,
                    previlage: previlage,
                    message: message
                });
                console.log(data);
                try {
                    const otp = await getOTP();
                    console.log(otp);
                    // await sendMailOTP(email, firstName, otp);
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            user: "rahul.kirte@indicchain.com",
                            pass: "nvzasxqnwvdkxdse"
                        }
                    });

                    const options = {
                        from: "rahul.kirte@indicchain.com",
                        to: email,
                        subject: "One Time OTP",
                        text: "Your change account password OTP is " + otp
                    };

                    transporter.sendMail(options, (error) => {
                        if (error) {
                            console.log(error);
                        } else {

                        }
                    })

                    const findOtp = await otpDB.findOneAndDelete({ LoginEmailForgotPassword: email });
                    if (findOtp) {
                        console.log("old otp found");
                        const saveOtp = await new otpDB({
                            loginEmailForgotPassword: email,
                            loginEmailForgotPasswordOTP: otp
                        });
                        saveOtp.save();
                        data.save();

                        res
                            .status(200)
                            .send({
                                status: 200,
                                responseMessage: "Registered Successfully",
                            });

                    } else {
                        console.log("old otp not found");
                        const saveOtp = await new otpDB({
                            loginEmailForgotPassword: email,
                            loginEmailForgotPasswordOTP: otp
                        });
                        saveOtp.save();
                        data.save();

                        res
                            .status(200)
                            .send({
                                status: 200,
                                responseMessage: "Registered Successfully",
                            });
                    }

                } catch (error) {
                    res
                        .status(500)
                        .send({
                            status: "Failed",
                            error: error,
                            responseMessage: "Server Error",
                        });
                }
            }
        } else {
            return res
                .status(400)
                .send({
                    status: "Client side Error",
                    responseMessage: "Invalid Email!",
                });
        }
    } else {
        return res
            .status(400)
            .send({
                status: "Client side Error",
                responseMessage: "All fields are required!",
            });
    }

};

const signEmailOtpVerification = async (req, res) => {
    const { emailOTP } = req.body


    if (emailOTP) {
        const checkOTP = await otpDB.findOne({ loginEmailForgotPasswordOTP: emailOTP })
        console.log(checkOTP);
        const userEmail = checkOTP.loginEmailForgotPassword

        if (checkOTP) {
            console.log(emailOTP, userEmail);
            try {


                const userVerify = await userDB.updateOne({ email: userEmail }, {
                    $set: { isVerified: true }
                });

                const deletOTP = await otpDB.findOneAndDelete({
                    loginEmailForgotPasswordOTP: emailOTP
                })

                return res.status(200).send({ status: "Success", message: "User verified Succesfully" })
            } catch (error) {
                return res.status(500).send({
                    status: "Error", message: error
                })
            }
        } else {
            return res.status(400).send({
                status: "Error", message: "Invalid OTP!",
            });
        }
    } else {
        return res.status(400).send({ message: "Please Enter OTP compulsory." })
    }


}

const changeUserPassword = async (req, res) => {
    const { email, password, confirmPassword } = req.body

    const user = userDB.findOne({ email: email })

    if (user) {
        if (password === confirmPassword) {
            const salt = await bcrypt.genSalt(10)
            const hashPass = await bcrypt.hash(password, salt)

            try {
                await userDB.findByIdAndUpdate(user._id, {
                    $set: {
                        password: hashPass
                    },
                });
                res.status(200).send({ status: "Success", message: "Password Changed Successfully." })

            } catch (error) {
                res.status(400).send({ status: "Error", message: error })
            }
        } else {
            res.status(200).send({ status: "Success", message: "Password and Confirm Password is not matching." })
        }
    } else {
        return res.status(400).status({ status: "Error", message: "Invalid User" })
    }
}
const forgetPassword = async (req, res) => {
    const { email } = req.body
    //SendOTP
    const getOTP = otp.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });

    const validEmail = validator.validate(email)

    if (validEmail) {
        const checkEmail = await otpDB.findOne({ loginEmailForgotPassword: email })

        if (checkEmail) {
            await otpDB.findOneAndDelete({ 
                loginEmailForgotPassword : email
            })

            var subject = "Your One Time OTP for Forget Password Is"
            var text = ` Your OTP for forget password is ${getOTP}`;

            sendMailOTP(email, subject, text);

            const sendData = new otpDB({
                loginEmailForgotPassword: email,
                loginEmailForgotPasswordOTP: getOTP
            });

            sendData.save()
            return res
                .status(200)
                .send({
                    status: "success",
                    message: "Kindly check your email to recover your password",
                });

        } else {
            var subject = "Your One Time OTP for Forget Password Is"
            var text = ` Your OTP for forget password is ${getOTP}`;

            sendMailOTP(email, subject, text);

            const sendData = new otpDB({
                loginEmailForgotPassword: email,
                loginEmailForgotPasswordOTP: getOTP
            });

            sendData.save()
            return res
                .status(200)
                .send({
                    status: "success",
                    message: "Kindly check your email to recover your password",
                });
        }

    } else {
        return res
            .status(400)
            .send({
                status: "Error",
                message: "Invalid Email Id.",
            });
    }
}


const verifyOTP = async (req,res)=>{
    const { emailOTP } = req.body

    if(emailOTP){
        const validateOTP = await otpDB.findOne({
            loginEmailForgotPasswordOTP : emailOTP
        })
        if (validateOTP) {
            res.status(200).send({ status : "Success", message: "OTP verified successfully." })
            await otpDB.findOneAndDelete({ 
                loginEmailForgotPasswordOTP : emailOTP
            })
        } else {
            res.status(400).send({ status : "Error", message: " Invalid OTP " })
        }
    }else{
        res.status(200).send({ status : "Error", message: "OTP is required." })
    }


};

const uploadImage = async (req,res) =>{
    
    console.log("File", req.file);
    res.send("Image Received successfully")
}

const showUserList = async (req, res) => {
    const allUser = await userDB.find({ role : "USER" })
    // console.log(allUser);
    return res.status(200).send(allUser)
}

const showAllUserList = async (req, res) => {
    const allUser = await userDB.find() 
    // console.log(allUser);
    return res.status(200).send(allUser)
}

module.exports = {
    userSignup,
    signEmailOtpVerification,
    changeUserPassword,
    forgetPassword,
    uploadImage,
    verifyOTP,
    showUserList,
    showAllUserList
}
