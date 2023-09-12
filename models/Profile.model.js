const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  occupation: { type: String },
  location: { type: String },
  avatarUrl: { type: String },
  interests: [String]
  //   projects: { type: Schema.Types.ObjectId, ref: "Project" }
});

module.exports = model("Profile", profileSchema);
