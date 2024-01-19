const mongoose = require("mongoose");

const repairSchema = new mongoose.Schema( 
  {
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    address:{
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    articles: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Article",
        },
      ],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Repair", repairSchema);

