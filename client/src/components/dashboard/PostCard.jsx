import { useContext, useState } from "react";
import Avatar from "/public/avatar-placeholder.png";
import { Link } from "react-router-dom";
import { UserContext } from "../context/userContext";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const PostCard = ({ post }) => {
  const [reply, setReply] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [likes, setLikes] = useState(post.likes);
  const { userData } = useContext(UserContext);

  /******************************************************
   *   Post Liken
   ******************************************************/
  const handleLikeClick = async () => {
    try {
      const response = await fetch(`${API_URL}/likePost/${post._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userData._id }),
      });

      if (!response.ok) {
        throw new Error("Failed to like the post");
      }

      const updatedPost = await response.json();
      setLikes(updatedPost.likes);
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };

  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  /******************************************************
   *    Kommentar absenden
   ******************************************************/
  const submitReply = async () => {
    if (reply.trim() !== "") {
      try {
        const response = await fetch(`${API_URL}/addComment/${post._id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            commentText: reply,
            userId: userData._id,
          }),
        });

        if (response.ok) {
          const updatedPost = await response.json();
          setReply("");
          setComments(updatedPost.comments);
        } else {
          throw new Error("Failed to add comment to post");
        }
      } catch (error) {
        console.error("Error adding comment to post:", error);
      }
    }
  };

  /******************************************************
   *    Kommentare anzeigen
   ******************************************************/
  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
  };

  const postUser = post.user || {};

  return (
    <div className="reusableBorder mt-4 p-4 flex flex-col w-full">
      <div className="flex justify-between items-center mb-4">
        <Link to={`/profile/${postUser._id}`} className="flex items-center">
          <aside className="flex items-center">
            <img
              src={postUser.image || Avatar}
              alt="Profilbild"
              className="h-10 w-10 rounded-full"
            />
            <div>
              <span className="font-semibold ml-2">{postUser.userName}</span>
            </div>
          </aside>
        </Link>
        <aside>
          {formatDistanceToNow(new Date(post.createdAt), {
            addSuffix: true,
            locale: de,
          })}
        </aside>
      </div>
      {post.image && (
        <img
          src={post.image}
          alt="Postbild"
          className="mb-4 w-full object-cover rounded-lg shadow-lg"
        />
      )}
      <p className="mb-4  dark:text-gray-400">{post.text}</p>
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span
          type="button"
          className="flex items-center"
          onClick={handleLikeClick}
        >
          <span className="mr-2 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
              />
            </svg>
          </span>
          <span className="text-white">{likes.length}</span>
        </span>
        <span
          onClick={toggleCommentsVisibility}
          className="text-white hover:text-gray-200 cursor-pointer"
        >
          Alle {comments.length} Kommentare anzeigen
        </span>
      </div>
      {showComments && (
        <div className="mt-2">
          {comments.map((comment) => (
            <div key={comment._id} className="mt-4 flex items-center">
              <Link
                to={`/profile/${comment.user._id}`}
                className="flex items-center"
              >
                <img
                  src={comment.user?.image || Avatar}
                  alt="Profilbild"
                  className="h-10 w-10 rounded-full mr-4"
                />
              </Link>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <Link
                    to={`/profile/${comment.user._id}`}
                    className="flex items-center"
                  >
                    <span className="text-base font-semibold ">
                      {comment.user
                        ? `${comment.user.userName}`
                        : "Ehemaliger Nutzer"}{" "}
                    </span>
                  </Link>
                  <span>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                      locale: de,
                    })}
                  </span>
                </div>
                <p>{comment.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-4 flex items-center w-full">
        <img
          src={userData.image || Avatar}
          alt="Profilbild"
          className="h-10 w-10 rounded-full mr-2"
        />
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg"
          placeholder="Antworten"
          value={reply}
          onChange={handleReplyChange}
          style={{ width: "70%" }}
        />
        <span className="w-3/20 ml-2" onClick={submitReply}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default PostCard;
