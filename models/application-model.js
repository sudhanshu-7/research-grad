const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const applicationSchema = {
    title: String,
    organisation: String,
    location: String,
    stipend: Number,
    duration: String,
    beginningDate: String,
    applyBy: String
}

const application = new Schema(applicationSchema, {timestamps: true});

module.exports = mongoose.model("applications", application);
