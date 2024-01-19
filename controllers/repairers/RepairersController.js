const Repairer = require("../../models/repairers/Repairer");
const HTTP_STATUS = require("../../utils/HTTP");

class RepairersController {
  //get All Repairers
  static getAllRepairers = async (req, res) => {
    try {
      const repairers = await Repairer.find();
      if (!repairers) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "No repairer were found" });
      }

      return res.status(HTTP_STATUS.OK).json({ repairers });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //get one Repairer
  static getOneRepairer = async (req, res) => {
    const { repairerId } = req.params;
    try {
      const repairer = await Repairer.findOne({ _id: repairerId });
      if (!repairer) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repairer not found" });
      }

      return res.status(HTTP_STATUS.OK).json({ repairer });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //create a Repairer
  static createRepairer = async (req, res) => {
    const { firstName, lastName, phone } = req.body;
    try {
      if (!firstName || !lastName || !phone) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please fill all the fields" });
      }

      const newRepairer = new Repairer({
        firstName,
        lastName,
        phone,
      });

      await newRepairer.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "New repairer created successfully", newRepairer });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //update a Repairer
  static updateRepairer = async (req, res) => {
    const { repairerId } = req.params;
    const { firstName, lastName, phone } = req.body;
    try {
      const repairer = await Repairer.findOne({ _id: repairerId });
      if (!repairer) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repairer not found" });
      }

      if (firstName) repairer.firstName = firstName;
      if (lastName) repairer.lastName = lastName;
      if (phone) repairer.phone = phone;

      await repairer.save();

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Repairer updated successfully", repairer });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //delete Repairer
  static deleteRepairer = async (req, res) => {
    const { repairerId } = req.params;
    console.log(req.params)
    try {
      const repairer = await Repairer.findOne({ _id: repairerId });
      if (!repairer) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repairer not found" });
      }
      await Repairer.findByIdAndDelete(repairer.id);

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Repairer deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };
}

module.exports = RepairersController;
