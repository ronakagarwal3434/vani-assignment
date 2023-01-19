const User = require("../models/user.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const requireSignin = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(401).json({
                message: "You are not logged in. Please log in to get access",
            });
        }

        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findById(decoded._id);

        if (!user) {
            res.status(401).json({
                message: "The user with the given token doesnot exist",
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message:
                    "You do not have the permssions to perform this action!",
            });
        }
        next();
    };
};

module.exports = {
    requireSignin,
    restrictTo,
};
