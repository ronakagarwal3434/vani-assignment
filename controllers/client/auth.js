const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const { sendSMS, AddMinutesToDate } = require("../../helpers/auth");

const signToken = async (id) => {
    return jwt.sign({ _id: id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

const generateOtp = async (req, res) => {
    console.log("OTP GENERATION ENDPOINT => ", req.body);
    const { phone, role } = req.body;
    try {
        // validation
        let user = await User.findOne({ phone, role });
        if (!user) user = new User({ phone, role });

        // generate otp
        let otp = parseInt(Math.random() * 1000000);
        let now = new Date();
        let expiration_time = AddMinutesToDate(now, 5);

        // save otp in db
        user.otp = otp;
        user.otpExpiresAt = expiration_time;
        await user.save();

        // send otp
        await sendSMS(
            phone,
            `Your otp is ${otp} and is valid for only 5 minutes.`
        );
        return res.json({
            status: "success",
            message: "OTP sent to your phone!",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

const verifyOtp = async (req, res) => {
    console.log("OTP VERIFICATION ENDPOINT => ", req.body);
    const { phone, role, otp } = req.body;
    try {
        const user = await User.findOne({ phone, role });
        if (!user)
            return res.status(400).json({
                status: "error",
                message: "User Not Found!",
            });

        // check otp
        let now = new Date();
        if (user.otpExpiresAt < now)
            return res.json({
                error: "Time Exceeded!",
            });

        if (user.otp != otp)
            return res.json({
                error: "Invalid Otp!",
            });

        // create signed token
        const token = await signToken(user._id);
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        return res.json({
            status: "success",
            message: "Logged In!",
            data: { token, user },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

const loginFromJWT = async (req, res) => {
    try {
        const jwtToken = req.body.token;
        const decoded = await promisify(jwt.verify)(
            jwtToken,
            process.env.JWT_SECRET
        );
        const userId = decoded._id;
        const user = await User.findById(userId);
        if (!user)
            return res.status(400).json({
                status: "error",
                message: "User Not Found!",
            });

        const token = await signToken(user._id);
        user.otp = undefined;
        user.otpExpiresAt = undefined;

        return res.json({
            status: "success",
            message: "Logged In!",
            data: { token, user },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

module.exports = {
    generateOtp,
    verifyOtp,
    loginFromJWT,
};
