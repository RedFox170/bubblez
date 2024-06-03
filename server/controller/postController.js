import jwt from "jsonwebtoken";
import PostModel from "../models/postSchema.js";

/******************************************************
 *    createPost
 ******************************************************/
export const createPost = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Authorization failed: JWT token not found in cookie",
      });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = decodedToken.user;
    const userId = user._id;

    const { content, image, link } = req.body;

    if (!content && !image && !link) {
      return res
        .status(400)
        .json({ message: "Content, image or link must be provided" });
    }

    const newPost = new PostModel({
      user: userId,
      text: content,
      image,
      link,
    });

    await newPost.save();

    const populatedPost = await PostModel.findById(newPost._id).populate(
      "user",
      "userName image"
    );

    res.status(201).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

/******************************************************
 *    getPosts
 ******************************************************/
export const getPosts = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate("user", "userName image")
      .populate({
        path: "comments.user",
        select: "userName image",
      })
      .sort({ createdAt: -1 });
    console.log("Fetched posts from DB:", posts);
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error });
  }
};

/******************************************************
 *    addComment
 ******************************************************/
export const addComment = async (req, res, next) => {
  try {
    const { commentText, userId } = req.body;
    const { postId } = req.params;

    const comment = {
      user: userId,
      text: commentText,
    };

    const post = await PostModel.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate({
      path: "comments.user",
      select: "userName image",
    });

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

/******************************************************
 *    likePost
 ******************************************************/
export const likePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await PostModel.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      // Like the post
      post.likes.push(userId);
    }

    await post.save();

    const populatedPost = await PostModel.findById(postId).populate(
      "user",
      "userName image"
    );

    res.status(200).json(populatedPost);
  } catch (error) {
    next(error);
  }
};

/******************************************************
 *    getPostByCreatorId
 ******************************************************/

/* export const getPostByCreatorId = async (req, res, next) => {
  try {
    const creatorId = req.params.id;
    console.log("creatorId", creatorId);
    const news = await PostModel.find({ creator: creatorId });
    res.status(200).send(news);
  } catch (error) {
    next(error);
  }
}; */

/******************************************************
 *    updatePosts
 ******************************************************/
/* export const updatePosts = async (req, res, next) => {
  try {
    const newsId = req.params.id;
    const { title, text } = req.body;
    const news = await PostModel.findById({ _id: newsId });
    news.title = title;
    news.text = text;
    await news.save();
    res.status(200).send(news);
  } catch (error) {
    next(error);
  }
}; */

/******************************************************
 *    deletePost
 ******************************************************/

/* export const deletePost = async (req, res, next) => {
  try {
    const newsId = req.params.id;

    await PostModel.findByIdAndDelete(newsId);
    res.status(200).send({ message: "News successfully deleted" });
  } catch (error) {
    next(error);
  }
};
 */
