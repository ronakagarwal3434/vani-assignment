const Vehicle = require("../../models/vehicle");
const VehicleStation = require("../../models/vehicle-station");

const createVehicle = async (req, res) => {
    try {
        const { vehicleNumber } = req.body;
        const vehicle = new Vehicle({ vehicleNumber });
        await vehicle.save();

        return res.json({
            status: "success",
            message: "Vehicle created!",
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

const createVehicleStation = async (req, res) => {
    try {
        const { name } = req.body;
        const vehicleStation = new VehicleStation({ name });
        await vehicleStation.save();

        return res.json({
            status: "success",
            message: "Vehicle Station created!",
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

const addToInventory = async (req, res) => {
    try {
        const vehicleId = req.params._id;
        const vehicle = await Vehicle.findById(vehicleId);
        if (vehicle.isInInventory)
            return res.json({
                error: "Already added!",
            });
        vehicle.isInInventory = true;
        await vehicle.save();
        return res.json({
            status: "success",
            message: "Vehicle added to inventory!",
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

const addToStation = async (req, res) => {
    try {
        const vehicleStationId = req.params._id;
        const vehicleId = req.body.vehicle;
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle.isInInventory)
            return res.status(400).json({
                status: "error",
                message: "Vehicle Not In Inventory!",
            });
        if (vehicle.isInStation)
            return res.status(400).json({
                status: "error",
                message: "Already in station!",
            });
        const vehicleStation = await VehicleStation.findByIdAndUpdate(
            vehicleStationId,
            {
                $addToSet: {
                    vehicles: vehicleId,
                },
            },
            {
                new: true,
            }
        );
        vehicle.isInStation = true;
        vehicle.stationName = vehicleStation.name;
        await vehicle.save();
        return res.json({
            status: "success",
            message: "Vehicle added to inventory!",
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

module.exports = {
    createVehicle,
    createVehicleStation,
    addToInventory,
    addToStation,
};
