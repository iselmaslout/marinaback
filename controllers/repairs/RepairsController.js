const Repair = require("../../models/repairs/Repair");
const Repairer = require("../../models/repairers/Repairer");
const Article = require("../../models/articles/Article");
const HTTP_STATUS = require("../../utils/HTTP");

class RepairsController {
  //get All Repairs
  static getAllRepairs = async (req, res) => {
    try {
      const repairs = await Repair.find().populate("repairer");
      if (!repairs) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "No repair were found" });
      }

      return res.status(HTTP_STATUS.OK).json({ repairs });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //get one Repair
  static getOneRepair = async (req, res) => {
    const { repairId } = req.params;
    try {
      const repair = await Repair.findOne({ _id: repairId });
      if (!repair) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repair not found" });
      }

      return res.status(HTTP_STATUS.OK).json({ repair });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //create a Repair
  static createRepair = async (req, res) => {
    const { repairer, articles, phone } = req.body;
    let VerifiedArticles = [];
    let price = 0;

    try {
      if (!articles || articles.length === 0 || !repairer || !phone) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please fill all the fields" });
      }

      const selectedRepairer = await Repairer.findOne({ _id: repairer });
      if (!selectedRepairer) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repairer not found" });
      }

      if (articles && articles.length > 0) {
        for (const articleId of articles) {
          const article = await Article.findOne({ _id: articleId });
          price += article.buyPrice;
          VerifiedArticles.push(article._id);
        }
      }

      const newRepair = new Repair({
        articles: VerifiedArticles,
        repairer: selectedRepairer._id,
        phone,
      });

      await newRepair.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "New repair created successfully", newRepair });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //update a Repair
  static updateRepair = async (req, res) => {
    const { repairId, repairer, articles, phone } = req.body;

    try {
      if (
        !repairId ||
        !repairer ||
        !articles ||
        articles.length === 0 ||
        !phone
      ) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please provide valid data for update" });
      }

      const existingRepair = await Repair.findOne({ _id: repairId });
      if (!existingRepair) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repair not found" });
      }

      const selectedRepairer = await Repairer.findOne({ _id: repairer });
      if (!selectedRepairer) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repairer not found" });
      }

      let VerifiedArticles = [];
      let price = 0;

      for (const articleId of articles) {
        const article = await Article.findOne({ _id: articleId });
        if (article) {
          price += article.buyPrice;
          VerifiedArticles.push(article._id);
        }
      }

      // Update the existing repair with new data
      existingRepair.articles = VerifiedArticles;
      existingRepair.repairer = selectedRepairer._id;
      existingRepair.phone = phone;

      // Save the updated repair
      await existingRepair.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Repair updated successfully",
        updatedRepair: existingRepair,
      });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //delete Repair
  static deleteRepair = async (req, res) => {
    const { repairId } = req.params;
    console.log(repairId);

    try {
      const repair = await Repair.findOne({ _id: repairId });
      if (!repair) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Repair not found" });
      }
      await Repair.findByIdAndDelete(repairId);

      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Repair deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };
}
module.exports = RepairsController;
