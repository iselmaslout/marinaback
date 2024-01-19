const mongoose = require("mongoose");

const repairsSchema = new mongoose.Schema(
  {
    satus: {
      type: String,
      required: true,
      default: "Pending",
    },
    repairer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Repairer",
    },
    phone: {
      type: String,
      required: true,
    },
    articles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Article",
      },
    ],
    price: {
      type: Number, 
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Repair", repairsSchema);
