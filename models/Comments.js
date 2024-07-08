const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipe: {
    type: Schema.Types.ObjectId,
    ref: "recipe",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
