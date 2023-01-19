const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            required: true,
        },
        otp: {
            type: Number,
        },
        otpExpiresAt: {
            type: Date,
        },
        vehiclesPickedUp: [{ type: Schema.ObjectId, ref: "Vehicle" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
