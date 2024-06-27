import { useState } from "react";
import Avatar from "/public/avatar-placeholder.png";
import { handleImageUpload } from "../cloudinary/handleImageUpload";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const PostForm = ({ setPosts, user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  /******************************************************
   *    Extrahieren von Links aus dem Text
   ******************************************************/
  const extractLinks = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    return urls || [];
  };

  /******************************************************
   *    Einreichen des Posts
   ******************************************************/
  const handleSubmit = async (e) => {
    e.preventDefault();

    const links = extractLinks(content);

    const formData = {
      content,
      links,
      image, // Bild-URL, falls hochgeladen
    };

    console.log("formData in PostForm", formData);

    try {
      const response = await fetch(`${API_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      console.log(response);
      if (response.ok) {
        const newPost = await response.json();
        setPosts((prevPosts) => [newPost, ...prevPosts]);
        setContent("");
        setImage(null); // Bild zurücksetzen
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post", error);
    }
  };

  /******************************************************
   *    Bild-Upload-Handling
   ******************************************************/
  const onImageChange = async (event) => {
    setUploading(true);
    await handleImageUpload(event, setImage);
    setUploading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full mb-4 flex flex-col items-start"
    >
      <div className="flex items-center mb-4">
        <img
          src={user.image || Avatar}
          alt="Profile"
          className="w-14 h-14 object-cover rounded-full"
        />
        <div className="ml-4 flex flex-col items-center">
          <span className="font-semibold">{user.userName}</span>
        </div>
      </div>
      <textarea
        className="w-full p-2 text-black border rounded-md font"
        placeholder="Was machst du gerade?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex items-center mt-2">
        <input
          type="file"
          id="imageUpload"
          className="hidden"
          onChange={onImageChange}
        />
        <label htmlFor="imageUpload" className="cursor-pointer">
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
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
        </label>
        {uploading && <span className="ml-2">Bild wird hochgeladen...</span>}
      </div>
      {image && (
        <img src={image} alt="Selected" className="mt-4 w-full h-auto" />
      )}
      <button
        type="submit"
        className="mt-2 px-4 py-2 border border-gray-300 rounded-md bg-black-500 text-white hover:bg-gray-600"
      >
        Posten
      </button>
    </form>
  );
};

export default PostForm;
