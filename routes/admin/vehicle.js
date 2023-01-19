const express = require("express");
const router = express.Router();

const { requireSignin, restrictTo } = require("../../middlewares");

// Vehicle
const {
    createVehicle,
    createVehicleStation,
    addToInventory,
    addToStation,
} = require("../../controllers/admin/vehicle");

router.post("/", requireSignin, restrictTo("admin"), createVehicle);
router.post("/station", requireSignin, restrictTo("admin"), createVehicleStation);
router.put("/add-to-inventory/:_id", requireSignin, restrictTo("admin"), addToInventory);
router.put("/add-to-station/:_id", requireSignin, restrictTo("admin"), addToStation);

module.exports = router;