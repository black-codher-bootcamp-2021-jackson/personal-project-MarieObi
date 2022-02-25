const mongoose = require("mongoose");
const { Schema } = mongoose;

const userProfileSchema = new Schema({
  country: String,
  display_name: String,
  followers: {
    total: Number
  },
});

mongoose.model("profiles", userProfileSchema);