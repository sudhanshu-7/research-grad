const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const applicationSchema = {
    title: String,
    organisation: String,
    tags: Array,
    location: String,
    stipend: Number,
    duration: String,
    beginningDate: Date,
    applyBy: Date
}

const application = new Schema(applicationSchema, {timestamps: true});

module.exports = mongoose.model("applications", application);
