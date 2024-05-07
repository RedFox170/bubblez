import { useContext, useState } from "react";
import Avatar from "../../../public/avatar-placeholder.png";
import { useParams } from "react-router-dom";
import { GroupsContext } from "../context/groupsContext";
/* Zeitdarstellungspaket  Zeit bis jetzt in h */
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale"; // Importiere das deutsche Locale
import { UsersContext } from "../context/usersContext";

const GroupPostCard = ({ post }) => {
  const [reply, setReply] = useState("");
  const { groupId } = useParams();
  const { groupsData, setGroupsData } = useContext(GroupsContext);
  const postId = post._id;
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const { usersData } = useContext(UsersContext);

  console.log("usersdata in GroupPostCard", usersData);
  /*  console.log("post in GroupPostCard", );
console.log("groupID in GroupPostCard", groupId);
console.log("postID in GroupPostCard", postId); */
  console.log("groupsData in GroupPostCard", groupsData);

  //userdaten für das ProfilBild
  const user = JSON.parse(localStorage.getItem("userData"));
  const userId = user._id;
  // console.log("userId in GroupPostCard", userId);

  const formattedDate = new Date(post.postTime).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // !Überprüfe, ob likes und comments definiert sind und setze sie auf ein leeres Array, falls nicht
  /*  const likes = post.likes || [];
  const comments = Array.isArray(post.comments) ? post.comments : []; */

  /******************************************************
   *    Profilpic
   ******************************************************/
  const profilImg = () => {
    if (user.image === undefined || null) {
      return Avatar;
    } else {
      return user.image;
    }
  };

  /******************************************************
   *    GruppenPost Liken
   ******************************************************/

  const handleLikeClick = async () => {
    // Kopie des aktuellen Zustands, um bei einem Fehler zurückzusetzen
    const currentGroupsData = [...groupsData];

    // Optimistisches Update des Zustands
    setGroupsData((prevGroupsData) => {
      return prevGroupsData.map((group) => {
        if (group._id === groupId) {
          return {
            ...group,
            groupPosts: group.groupPosts.map((post) =>
              post._id === postId
                ? { ...post, likes: [...post.likes, userId] }
                : post
            ),
          };
        }
        return group;
      });
    });

    try {
      const response = await fetch(
        `http://localhost:5500/likePost/${groupId}/${postId}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to like the post");
      }

      const updatedPost = await response.json();
      console.log("Aktualisierter Post:", updatedPost);
      // Bestätige das optimistische Update
      setGroupsData((prevGroupsData) => {
        return prevGroupsData.map((group) => {
          if (group._id === groupId) {
            return {
              ...group,
              groupPosts: group.groupPosts.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
              ),
            };
          }
          return group;
        });
      });
    } catch (error) {
      console.error("Error liking the post:", error);
      // Setze bei Fehlern den vorherigen Zustand wieder her
      setGroupsData(currentGroupsData);
    }
  };

  /******************************************************
   *    Antworten auf Kommentare
   ******************************************************/
  const handleReplyChange = (event) => {
    setReply(event.target.value);
  };

  const submitReply = async () => {
    if (reply.trim() !== "") {
      try {
        const response = await fetch(
          `http://localhost:5500/addComment/${groupId}/${postId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              commentText: reply,
              userId: userId,
            }),
          }
        );

        if (response.ok) {
          const updatedPost = await response.json();
          console.log("Aktualisierter Post:", updatedPost);
          setReply("");

          // Update des globalen Contexts, um den Post im UI zu aktualisieren
          setGroupsData((previousGroupsData) => {
            return previousGroupsData.map((group) => {
              if (group._id === groupId) {
                return {
                  ...group,
                  groupPosts: group.groupPosts.map((post) =>
                    post._id === updatedPost._id ? updatedPost : post
                  ),
                };
              }
              return group; // Wenn die Gruppe nicht die gesuchte ist, gebe sie unverändert zurück
            });
          });
          // Update des lokalen Kommentar-States
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
   *    Kommentare anzeigen (ein- und ausklappen)
   ******************************************************/
  const toggleCommentsVisibility = () => {
    setShowComments(!showComments);
    console.log("showComments in GroupPostCard", showComments);
  };

  console.log("comments in GroupPostCard", comments);

  return (
    <div className="reusableBorder  mt-4 p-4 flex flex-col w-full">
      {/* Kopfzeile mit Profilbild, Name und Datum */}
      <div className="flex justify-between items-center mb-4">
        <aside className="flex items-center">
          <img
            src={profilImg()}
            alt="Profilbild"
            className="h-10 w-10 rounded-full"
          />
          <div className="text-base ml-4 font-semibold text-gray-900 dark:text-gray-100">
            {post.commenter.userName}
          </div>
        </aside>
        <aside>{formattedDate}</aside>
      </div>

      {/* Kommentartext und optional das Bild */}
      {post.img && (
        <img
          src={post.img}
          alt="Kommentarbild"
          className="mb-4 w-full object-cover rounded-lg shadow-lg"
        />
      )}
      <p className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">
        {post.title}
      </p>
      <p className="mb-4 text-xl text-gray-700 dark:text-gray-400">
        {post.text}
      </p>

      {/* Fußzeile mit Like- und Kommentar-Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <button
          type="button"
          className="flex items-center"
          onClick={handleLikeClick}
        >
          <span className="mr-2">
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
          <span>{post.likes.length}</span>
        </button>
        <button
          onClick={toggleCommentsVisibility}
          className="text-gray-600 hover:text-gray-800"
        >
          Alle {comments.length} Kommentare anzeigen
        </button>
      </div>

      {showComments && (
        <div className="mt-2">
          {comments.map((comment) => {
            const commenter = usersData.find(
              (user) => user._id === comment.commenter
            );
            return (
              <div key={comment._id} className="mt-4 flex items-center">
                <img
                  src={commenter?.image || Avatar}
                  alt="Profilbild"
                  className="h-10 w-10 rounded-full mr-4"
                />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {commenter
                        ? `${post.commenter.userName}`
                        : "Unbekannter Nutzer"}
                    </span>
                    <span>
                      {formatDistanceToNow(new Date(comment.commentTime), {
                        addSuffix: true,
                        locale: de,
                      })}
                    </span>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Antwort-Sektion */}
      <div className="mt-4 flex items-center w-full">
        <img
          src={profilImg()} // Stelle sicher, dass diese Funktion oben definiert ist
          alt="Profilbild"
          className="h-10 w-10 rounded-full"
        />
        <input
          type="text"
          className="flex-grow p-2 border border-gray-300 rounded-lg"
          placeholder="Antworten"
          value={reply}
          onChange={handleReplyChange}
          style={{ width: "70%" }}
        />
        <button className="w-3/20 ml-2" onClick={submitReply}>
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
        </button>
      </div>
    </div>
  );
};

export default GroupPostCard;
