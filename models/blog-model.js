const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const blogSchema = {
    username: String,
    title: String,
    content: String,
    caption: String
}

const blog = new Schema(blogSchema, {timestamps: true});

module.exports = mongoose.model("blogs", blog);
