const mongoose = require("mongoose");
const QRCode = require("qrcode");
const { Schema } = mongoose;

const vehicleSchema = new Schema(
    {
        vehicleNumber: {
            type: Number,
            required: true,
        },
        isInInventory: {
            type: Boolean,
            required: true,
            default: false,
        },
        isInStation: {
            type: Boolean,
            required: true,
            default: false,
        },
        stationName: {
            type: String,
        },
        qrcode: {
            type: Object,
        },
        isPickedUp: {
            type: Boolean,
            required: true,
            default: false,
        },
        pickedUpBy: { type: Schema.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

vehicleSchema.pre("save", async function () {
    try {
        const stringdata = JSON.stringify(this);
        const qrCodeObj = await QRCode.create(stringdata);
        this.qrcode = qrCodeObj;
    } catch (error) {
        console.log(error);
    }
});
const Vehicle = mongoose.model("Vehicle", vehicleSchema);
module.exports = Vehicle;
