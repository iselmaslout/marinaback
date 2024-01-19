const express = require("express");

const RepairersController = require("../../controllers/repairers/RepairersController");
const router = express.Router();

router.get("/repairers", RepairersController.getAllRepairers);
router.get("/repairers/:repairerId", RepairersController.getOneRepairer);
router.post("/repairers", RepairersController.createRepairer);
router.put("/repairers/:repairerId", RepairersController.updateRepairer);
router.delete("/repairers/:repairerId", RepairersController.deleteRepairer);

module.exports = router;
