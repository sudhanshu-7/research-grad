const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = {
    username: String,
    fName: String,
    lName: String,
    email: String,
    password: String
}

const user = new Schema(userSchema, { timestamps: true });

module.exports = mongoose.model("users", user);