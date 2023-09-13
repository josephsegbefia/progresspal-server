const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const profileSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    firstName: { type: String },
    lastName: { type: String },
    occupation: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    interests: [String]
    //   projects: { type: Schema.Types.ObjectId, ref: "Project" }
  },
  {
    timestamps: true
  }
);

module.exports = model("Profile", profileSchema);
