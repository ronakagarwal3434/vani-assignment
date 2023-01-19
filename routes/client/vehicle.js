const express = require("express");

const router = express.Router();

const { requireSignin } = require("../../middlewares");

const {
    getVehicleStation,
    pickupVehicle,
    dropVehicle,
} = require("../../controllers/client/vehicle");

router.get("/station/:_id", requireSignin, getVehicleStation);
router.put("/pickup/:_id", requireSignin, pickupVehicle);
router.put("/drop/:_id", requireSignin, dropVehicle);

module.exports = router;