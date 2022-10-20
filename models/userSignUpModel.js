const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate")
const mongooseAggregatePaginate = require("mongoose-aggregate-paginate")
const status = require("../enums/status")
const userType = require("../enums/userType")
const kycStatus = require("../enums/kycStatus")
const cloudinary = require("../util/cloudinary")
const upload = require("../util/multer")
const bcrypt = require("bcrypt")
const { type } = require("os")
const { log } = require("console")

const userSignUpSchema = new mongoose.Schema({
    firstName:{
        type : String,
        trim : true
    },
    lastName:{
        type : String,
        trim : true
    },
    gender :  String,
    mobileNo : {
        type : String,
        trim : true
    },
    address : String,
    city : {
        type : String,
        trim : true
    },
    country : {
        type : String,
        trim : true
    },
    countryCode : {
        type : String,
        trim : true
    },
    zipCode : String,
    dateOfBirth : {
        type : String,
        trim : true
    },
    email : {
        type : String,
        trim : true
    },
    password : {
        type : String,
        trim : true
    },
    imageUrl : { type : String, default : null },
    kyc : {
        document : [
            {
            backIdUrl : { type : String, default : null },
            backIdUrlPdf : { type : String, default : null },
            docIdNumber : { type : String, default : null },
            docName : { type : String, default : null },
            documentId : { type : String, default : null },
            documentNumber : { type : String, default : null },
            documentStatus :{ type : String, default : null },
            frontIdUrl : { type : String, default : null },
            frontIdUrlPdf : { type : String, default : null },
            latest : { type : String, default : null },
            reason : { type : String, default : null },
        },{timestamps : true }
        ],
        kycId : { type : Number, default : 0 },
        kycStatus : { type : String, default : kycStatus.PENDING },

    },
    pnWithoutCountryCode : String,
    previlage : [
        {type : String, default: null}
    ],
    role : { type: String, default : userType.USER },
    state : { type: String, default:null },
    twoFaType: {type: String, default: "GOOGLE"},
    isVerified: {
        type: Boolean,
        default:false
    },
    message: {type: String, default:null},
    status: {type: Number, default: 200},
    
},{timestamps : true});

userSignUpSchema.plugin(mongoosePaginate);
userSignUpSchema.plugin(mongooseAggregatePaginate);

module.exports = mongoose.model("userSignUp", userSignUpSchema);

mongoose.model("userSignUp", userSignUpSchema).find({userType : "ADMIN"}, async(err, result)=>{
    if (err) {
        console.log("Default Admin Error", err);
    } else if(result.length != 0){
        console.log("Default Admin Running.");
    }else{
        let salt = await bcrypt.genSalt(10);
        let hashpass = await bcrypt.hash("Rahul@123", salt)
        let obj ={
            firstName : "Rahul ",
            lastName: "kirte",
            gender : "Male",
            mobileNo : "9370510109",
            address : "Near Nawale Hospital Narhe Pune",
            city : "Pune",
            country : "India",
            countryCode : "+91",
            zipCode : "411041",
            dateOfBirth : "12/11/1995",
            email : "rkirte12@gmail.com",
            password : hashpass,
            imageUrl: "http://pexel.com",
            kyc: {
                document: [
                    {
                    backIdUrl: "http://pexel.com",
                    backIdUrlPdf: "backId.pdf",
                    docIdNumber: "79229",
                    docName: "PAN",
                    documentId: "8229",
                    documentNumber: "1",
                    documentStatus:"VERIFIED",
                    frontIdUrl: "http://pexel.com",
                    frontIdUrlPdf:"http://readEra.com" ,
                    latest: "jaffd",
                    reason: "hdfkss"
                    }
                ],
                kycId: 1,
                kycStatus: kycStatus.ACCEPTED,
            },
            pnWithoutCountryCode : "",
            previlage : ["Dashboard"],
            role : userType.ADMIN,
            state : "Maharashtra",
            twoFaType : "GOOGLE",
            userId : "1",
            isVerified : true,
            message : "Welcome to INBT Dashboard- Contract Exchange",
            status : "200"
            
        }
        mongoose.model("userSignUp", userSignUpSchema).create(obj, async(err1, result1)=>{
            if (err1) {
                console.log("Default Admin creation error", err1);
            } else {
                console.log("DEFAULT ADMIN CREATED", result1);
            }
        })
    }

    
})

 
