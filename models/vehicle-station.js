const mongoose = require("mongoose");
const { Schema } = mongoose;

const vehicleStationSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        vehicles: [{ type: Schema.ObjectId, ref: "Vehicle" }],
    },
    { timestamps: true }
);

const VehicleStation = mongoose.model("VehicleStation", vehicleStationSchema);
module.exports = VehicleStation;
