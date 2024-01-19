const Ensemble = require("../../models/ensembles/Ensemble");
const Article = require("../../models/articles/Article");
const User = require("../../models/users/User");
const HTTP_STATUS = require("../../utils/HTTP");

class EnsembleController {
  //get All Ensembles
  static getAllEnsembles = async (req, res) => {
    try {
      const ensembles = await Ensemble.find();
      if (!ensembles) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "No ensemble were found" });
      }

      return res.status(HTTP_STATUS.OK).json({ ensembles });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //get one Ensemble
  static getOneEnsemble = async (req, res) => {
    const { ensembleId } = req.params;
    try {
      const ensemble = await Ensemble.findOne({ _id: ensembleId });
      if (!ensemble) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Ensemble not found" });
      }

      return res.status(HTTP_STATUS.OK).json({ ensemble });
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error });
    }
  };

  //create an ensemble
  static createEnsemble = async (req, res) => {
    const { name, description, creator, articles } = req.body;
    let VerifiedArticles = [];
    try {
      if (!name || !description || !creator || !articles) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please fill all the fields" });
      }

      const selectedCreator = await User.findOne({ _id: creator });
      if (!selectedCreator) {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: "User not found" });
      }

      if (articles && articles.length > 0) {
        for (const articleId of articles) {
          const article = await Article.findOne({ _id: articleId });
          VerifiedArticles.push(article._id);
        }
      }

      const newEnsemble = new Ensemble({
        name,
        description,
        creator: selectedCreator._id,
        articles: VerifiedArticles,
      });

      await newEnsemble.save();

      return res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "New ensemble created successfully", newEnsemble });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //update an ensemble
  static updateEnsemble = async (req, res) => {
    const { name, description, creator, articles } = req.body;
    const { ensembleId } = req.params;

    try {
      // Validate input fields
      if (
        !name ||
        !description ||
        !creator ||
        !articles ||
        !Array.isArray(articles)
      ) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please provide valid input data" });
      }

      // Check if the ensemble exists
      const existingEnsemble = await Ensemble.findOne({ _id: ensembleId });
      if (!existingEnsemble) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Ensemble not found" });
      }

      // Check if the creator exists
      const selectedCreator = await User.findOne({ _id: creator });
      if (!selectedCreator) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Creator not found" });
      }

      // Validate and verify articles
      const verifiedArticles = [];
      for (const articleId of articles) {
        const article = await Article.findOne({ _id: articleId });
        if (article) {
          verifiedArticles.push(article._id);
        } else {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: `Article with ID ${articleId} not found` });
        }
      }

      // Update ensemble fields
      existingEnsemble.name = name;
      existingEnsemble.description = description;
      existingEnsemble.creator = selectedCreator._id;
      existingEnsemble.articles = verifiedArticles;

      // Save the updated ensemble
      await existingEnsemble.save();

      return res.status(HTTP_STATUS.OK).json({
        message: "Ensemble updated successfully",
        updatedEnsemble: existingEnsemble,
      });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };

  //get one Ensemble
  static deleteEnsemble = async (req, res) => {
    const { ensembleId } = req.params;
    try {
      const ensemble = await Ensemble.findOne({ _id: ensembleId });
      if (!ensemble) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Ensemble not found" });
      }
      await Ensemble.findByIdAndDelete(ensemble.id);

      return res
        .status(HTTP_STATUS.OK)
        .json({ message: "Ensemble deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal server error" });
    }
  };
}

module.exports = EnsembleController;
