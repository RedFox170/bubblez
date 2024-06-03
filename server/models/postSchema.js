import mongoose from "mongoose";
const { Schema, model } = mongoose;

const commentSchema = new Schema({
  text: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
});

const postSchema = new Schema({
  text: { type: String, required: true },
  image: { type: String },
  link: { type: String },
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  createdAt: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: "users" }],
  comments: [commentSchema],
});

const Post = model("Post", postSchema);
export default Post;
