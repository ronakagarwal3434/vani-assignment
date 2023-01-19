const VehicleStation = require("../../models/vehicle-station");
const Vehicle = require("../../models/vehicle");

const getVehicleStation = async (req, res) => {
    try {
        const vehicleStationId = req.params._id;
        const vehicleStation = await VehicleStation.findById(
            vehicleStationId
        ).populate("vehicles");
        return res.json({
            status: "success",
            data: { vehicleStation },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

const pickupVehicle = async (req, res) => {
    try {
        const vehicleId = req.params._id;
        const vehicleStationId = req.body.vehicleStation;

        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle.isPickedUp)
            return res.status(400).json({
                status: "error",
                message: "Already Picked Up!",
            });
        req.user.vehiclesPickedUp.push(vehicleId);
        await VehicleStation.findByIdAndUpdate(vehicleStationId, {
            $pull: {
                vehicles: vehicleId,
            },
        });
        vehicle.isPickedUp = true;
        vehicle.pickedUpBy = req.user._id;
        vehicle.isInStation = false;
        vehicle.stationName = undefined;

        await vehicle.save();
        await req.user.save();
        return res.json({
            status: "success",
            message: "Vehicle Picked Up",
            data: { vehicle },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

const dropVehicle = async (req, res) => {
    try {
        const vehicleId = req.params._id;
        const vehicleStationId = req.body.vehicleStation;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle.isPickedUp)
            return res.status(400).json({
                status: "error",
                message: "Already In Station!",
            });
        var index = req.user.vehiclesPickedUp.indexOf(vehicle._id);
        if (index > -1) {
            req.user.vehiclesPickedUp.splice(index, 1);
        }
        const vehicleStation = await VehicleStation.findByIdAndUpdate(
            vehicleStationId,
            {
                $addToSet: {
                    vehicles: vehicleId,
                },
            },
            { new: true }
        );
        vehicle.isPickedUp = false;
        vehicle.pickedUpBy = undefined;
        vehicle.isInStation = true;
        vehicle.stationName = vehicleStation.name;

        await vehicle.save();
        await req.user.save();
        return res.json({
            status: "success",
            message: "Vehicle Dropped",
            data: { vehicle },
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
    getVehicleStation,
    pickupVehicle,
    dropVehicle,
};
