const express = require ('express');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.sendMailOTP = async(to, firstName , otp)=>{
    let html =`<div style="font-size:15px">
    <p>Hello ${firstName},</p>
    <p>Please click on the following link>
       ${otp}
    </a>
        Verify email by using OTP
    </p> 
      <p>
          Thanks<br>
      </p>
  </div>`;
    var transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{

            user:"rahul.kirte@indicchain.com",
            pass:"nvzasxqnwvdkxdse"
        }
    });
    
    var mailOptions ={
        from:`<no-reply>@indicchain.com`,
        to:to,
        subject:'One Time OTP',
        html:html
    };
    return await transporter.sendMail(mailOptions);
}

exports.getOTP=()=>{
    var otp = Math.floor(1000 + Math.random() * 9000);
     return otp;
}

exports.getToken= (payload) => {
    var token =  jwt.sign(payload, "Rupali", { expiresIn: "24h" })
    return token;
  }

  exports.getImageUrl =async(files)=>{
    var result = await cloudinary.v2.uploader.upload(files[0].path);
    return result.secure_url;
  }