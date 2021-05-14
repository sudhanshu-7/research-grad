const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = {
    googleId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    image: {
      type: String,
    }
}

const user = new Schema(userSchema, { timestamps: true });

module.exports = mongoose.model("users", user);