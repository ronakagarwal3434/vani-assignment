const express = require("express");

const router = express.Router();

const {
    generateOtp,
    verifyOtp,
    loginFromJWT,
} = require("../../controllers/client/auth");

router.post("/generate-otp", generateOtp);
router.post("/verify-otp", verifyOtp);
router.post("/login-with-token", loginFromJWT);

module.exports = router;
