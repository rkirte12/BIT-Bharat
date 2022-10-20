const express = require("express")
const router = express.Router();
const controller = require("../controller/userController/userController");
const multer = require("multer")
const storage = multer.memoryStorage()
const uploads = multer({storage})


router.post("/user-signup", controller.userSignup);
router.post("/verify-user", controller.signEmailOtpVerification);
router.post("/change-Password", controller.changeUserPassword);
router.post("/forget-password",controller.forgetPassword);
router.post("/upload-image", controller.uploadImage)
router.post("/verify-otp", controller.verifyOTP)
router.get("/show-users", controller.showUserList)
router.get("/show-all-users", controller.showAllUserList)

module.exports=router;