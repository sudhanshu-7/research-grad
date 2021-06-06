const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = {
    username: {
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
    },
    email: {
        type: String
    },
    password:{
        type: String
    }
}

const userLocal = new Schema(userSchema, { timestamps: true });

module.exports = mongoose.model("usersLocal", userLocal);