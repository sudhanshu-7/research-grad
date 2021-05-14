const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const profileSchema = {
    googleId: String,
    username: String,
    age: String,
    phone: String,
    address: String,
    qualification: String,
    university: String,
    about: String,
    personalLife: String,
    commendations: String,
    website: String
}

const profile = new Schema(profileSchema, {timestamps: true});

module.exports = mongoose.model("profiles", profile);
