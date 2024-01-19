const Article = require("../../models/articles/Article");
const Color = require("../../models/colors/Colors");
const Supplier = require("../../models/suppliers/Supplier");
const Catalog = require("../../models/catalogs/Catalog");
const Category = require("../../models/categories/Category");
const User = require("../../models/users/User");

const HTTP_STATUS = require("../../utils/HTTP");

class ArticleController {
  // Get All Articles
  static getArticles = async (req, res) => {
    const { search, color, catalog, weight, type, price, sellPrice } =
      req.query;
    const query = {};
    console.log(req.query);
    try {
      if (search != undefined) {
        query.name = { $regex: new RegExp(search, "i") };
      }

      if (color != undefined) {
        const selectedColor = await Color.findOne({ _id: color });
        if (!selectedColor) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Color not found" });
        }
        query.color = selectedColor._id;
      }
      if (catalog) {
        const selectedCatalog = await Catalog.findOne({ name: catalog });
        if (!selectedCatalog) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Catalog not found" });
        }
        query.catalog = selectedCatalog._id;
      }

      if (type) {
        query.typeArticle = type;
      }

      if (weight) {
        query.weight = weight;
      }

      if (sellPrice) {
        query.sellPrice = sellPrice;
      }

      if (price) {
        query.buyPrice = price;
      }

      const articles = await Article.find(query)
        .populate("createdBy color supplier catalog")
        .sort({ createdAt: -1 });
      if (!articles) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "No article were found" });
      }
      return res.status(HTTP_STATUS.OK).json({ articles: articles || [] });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };

  // Get One Article By Id
  static getArticle = async (req, res) => {
    const { articleId } = req.params;
    try {
      const article = await Article.findOne({ _id: articleId }).populate(
        "createdBy color supplier catalog"
      );
      if (!article) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "No article were found" });
      }
      return res.status(HTTP_STATUS.OK).json({ article: article || {} });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };

  // Add Articles
  static createArticle = async (req, res) => {
    const actor = req.user;
    const {
      // status,
      name,
      description,
      weight,
      img,
      color,
      typeArticle,
      number,
      // catalog,
      supplier,
      sellPrice,
      buyPrice,
      category,
      barCode,
      // nbrOfArticles,
      // date,
      // idBase
      // cout
    } = req.body;
    try {
      if (
        !name ||
        !description ||
        !weight ||
        !color ||
        !typeArticle ||
        !number ||
        !supplier ||
        !sellPrice ||
        !category ||
        !buyPrice ||
        !barCode
      ) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: "Please fill all the fields" });
      }

      const selectedCatalog = await Catalog.findOne({ _id: category }).populate(
        "articles"
      );
      console.log(selectedCatalog);
      if (!selectedCatalog) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Category Not Found" });
      }

      //color check
      const selectedColor = await Color.findOne({ _id: color });
      if (!selectedColor) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Color not found" });
      }

      //supplier check
      const selectedSupplier = await Supplier.findOne({ _id: supplier });
      if (!selectedSupplier) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Supplier not found" });
      }

      //catalog check
      // const selectedCatalog = await Catalog.findOne({ _id: catalog });
      // if (!selectedCatalog) {
      //   return res
      //     .status(HTTP_STATUS.NOT_FOUND)
      //     .json({ message: "Catalog not found" });
      // }

      //creating new article
      const newArticle = new Article({
        name,
        description,
        weight,
        img,
        color: selectedColor._id,
        typeArticle,
        number,
        supplier: selectedSupplier._id,
        sellPrice,
        buyPrice,
        catalog: category,
        barCode,
        createdBy: actor._id,
      });
      await newArticle.save();
      selectedSupplier.articles.push(newArticle);
      await selectedSupplier.save();
      selectedCatalog.articles.push(newArticle);
      await selectedCatalog.save();

      res
        .status(HTTP_STATUS.CREATED)
        .json({ message: "New article created successfully", newArticle });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };

  // Edit Articles
  static updateArticle = async (req, res) => {
    const { articleId } = req.params;
    const {
      name,
      description,
      weight,
      img,
      color,
      typeArticle,
      number,
      catalog,
      supplier,
      sellPrice,
      buyPrice,
      category,
      createdBy,
    } = req.body;
    console.log(req.body);

    try {
      const article = await Article.findOne({ _id: articleId });

      if (!article) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Article not found" });
      }

      // Update properties only if they are provided in the request body

      if (name) article.name = name;
      if (description) article.description = description;
      if (weight) article.weight = weight;
      if (img) article.img = img;
      if (color) {
        const selectedColor = await Color.findOne({ _id: color });
        if (!selectedColor) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Color not found" });
        }
        article.color = selectedColor._id;
      }
      if (typeArticle) article.typeArticle = typeArticle;
      if (number) article.number = number;
      if (catalog) {
        const selectedCatalog = await Catalog.findOne({ _id: catalog });
        if (!selectedCatalog) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Catalog not found" });
        }
        article.catalog = selectedCatalog._id;
      }
      if (supplier) {
        const selectedSupplier = await Supplier.findOne({ _id: supplier });
        if (!selectedSupplier) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Supplier not found" });
        }
        // const oldSupplier = await Supplier.findOne({ _id: article.supplier });
        // oldSupplier.articles.filter((e) => e._id != articleId);
        // oldSupplier.save();
        // console.log("oldSupp", oldSupplier);
        article.supplier = selectedSupplier._id;
      }
      if (sellPrice) article.sellPrice = sellPrice;
      if (buyPrice) article.buyPrice = buyPrice;
      if (category) {
        const selectedCatalog = await Catalog.findOne({ _id: category });
        if (!selectedCategory) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Category not found" });
        }
        article.createdBy = selectedCatalog._id;
      }
      if (createdBy) {
        const selectedUser = await User.findOne({ _id: createdBy });
        if (!selectedUser) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "User not found" });
        }
        article.createdBy = selectedUser._id;
      }

      // Save the updated article
      const updatedArticle = await article.save();

      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Article updated successfully", updatedArticle });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };

  // Toggle Status
  static toggleStatus = async (req, res) => {
    const { articleId } = req.params;
    try {
      const article = await Article.findOne({ _id: articleId });
      if (!article) {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Article not found" });
      }
      const articleStatusUpdated = await Article.findByIdAndUpdate(
        article._id,
        {
          status: !article.status,
        },
        { new: true }
      );
      return res.status(HTTP_STATUS.OK).json({
        message: "Article Status Updated successfully",
        Catalog: articleStatusUpdated,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ error: "Internal Server Error" });
    }
  };

  // Delete Articles
  static deleteArticle = async (req, res) => {
    const { articleId } = req.params;

    try {
      const article = await Article.findOne({ _id: articleId });
      if (!article) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: "Article not found" });
      }
      await Article.findByIdAndDelete(articleId);

      res
        .status(HTTP_STATUS.OK)
        .json({ message: "Article deleted successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(HTTP_STATUS.HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error" });
    }
  };
}

module.exports = ArticleController;
