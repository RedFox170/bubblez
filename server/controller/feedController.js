// controllers/feedController.js
import PostModel from "../models/postSchema.js";
import UserModel from "../models/userSchema.js";
import GroupsModel from "../models/groupsSchema.js";

/******************************************************
 *    getFeed
 ******************************************************/

export const getFeed = async (req, res) => {
  console.log("getFeed controller löst aus");
  try {
    const userId = req.user.user._id;
    console.log("userId im feedController", userId);

    // Eigene Beiträge
    const ownPosts = await PostModel.find({ user: userId })
      .populate("user", "userName image")
      .populate({
        path: "comments.user",
        select: "userName image",
      });

    // Beiträge von Freunden
    const user = await UserModel.findById(userId).populate(
      "followUsers",
      "userName image"
    );
    const friendsPosts = await PostModel.find({
      user: { $in: user.followUsers },
    })
      .populate("user", "userName image")
      .populate({
        path: "comments.user",
        select: "userName image",
      });

    // Beiträge aus Gruppen
    const groups = await GroupsModel.find({ members: userId });

    const groupPosts = await PostModel.find({
      user: { $in: groups.map((group) => group.members).flat() },
    })
      .populate("user", "userName image")
      .populate({
        path: "comments.user",
        select: "userName image",
      });

    // Zusammenführen und sortieren
    const allPosts = [...ownPosts, ...friendsPosts, ...groupPosts];

    const sortedPosts = allPosts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(sortedPosts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching feed", error });
  }
};
