const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.ObjectId,
      ref: "Category",
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    photo: [
      {
        url: {
          type: String,
          required: true,
        }
      }
    ],
    modelURL: {
      type: String,
      default: "", // optional
    },
    viewerURL: {
      type: String,
      default: "", // optional
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Products", productSchema);
