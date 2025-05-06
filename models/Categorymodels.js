const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    // unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});

// ✅ CommonJS export
module.exports = mongoose.model("Category", categorySchema);
