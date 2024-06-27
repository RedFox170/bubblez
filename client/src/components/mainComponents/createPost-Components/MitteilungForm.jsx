import { useState } from "react";
import "../../reuseable/styles/reusableFormComponents.css";
import "../../reuseable/styles/reusableGlobal.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const MitteilungForm = ({ closeModal, groupId, setGroupPosts, groupPosts }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") setTitle(value);
    if (name === "text") setText(value);
  };

  const onImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "your_cloudinary_preset"); // Ersetze durch deinen Cloudinary Upload Preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/your_cloudinary_name/image/upload", // Ersetze durch deinen Cloudinary Cloud Name
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUrl(data.secure_url);
    } catch (error) {
      console.error("Fehler beim Hochladen des Bildes", error);
    } finally {
      setUploading(false);
    }
  };

  const validateAndSubmitForm = async (event) => {
    event.preventDefault();

    if (title.length < 2 || title.length > 50) {
      setErrorMessage("Der Betreff muss zwischen 2 und 50 Zeichen lang sein.");
      return;
    }

    if (text.length < 2 || text.length > 5000) {
      setErrorMessage(
        "Die Nachricht muss zwischen 2 und 5000 Zeichen lang sein."
      );
      return;
    }

    setErrorMessage("");

    const formData = {
      title,
      text,
      topic: selectedTopic,
      imageUrl,
    };

    try {
      const response = await fetch(`${API_URL}/createGroupPost/${groupId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        closeModal();
        setGroupPosts((prevPosts) => [...prevPosts, data.post]);
      } else {
        console.error("Fehler beim Speichern des Posts");
        setErrorMessage("Es gab ein Problem beim Speichern Ihres Posts.");
      }
    } catch (error) {
      console.error("Fehler beim Senden der Daten", error);
      setErrorMessage("Es gab ein Problem beim Senden Ihrer Daten.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative reusableForm w-full max-w-lg p-6 mx-auto rounded-lg shadow-lg">
        <form onSubmit={validateAndSubmitForm} className="space-y-4">
          <header className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold">Wähle eine Option:</h2>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 cursor-pointer"
              onClick={closeModal}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </header>
          <section className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Betreff"
              value={title}
              onChange={handleInputChange}
              minLength="2"
              maxLength="50"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <textarea
              name="text"
              placeholder="Deine Nachricht"
              value={text}
              onChange={handleInputChange}
              minLength="2"
              maxLength="5000"
              className="w-full h-32 p-2 border border-gray-300 rounded-md"
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
              {uploading && (
                <span className="ml-2">Bild wird hochgeladen...</span>
              )}
            </div>
            <div className="flex justify-between">
              <ul className="flex justify-between w-full space-x-2">
                {["Allgemein", "Frage", "Aufruf", "Hinweis"].map((topic) => (
                  <li
                    key={topic}
                    className={`flex-1 p-2 cursor-pointer border border-gray-300 rounded-md text-center ${
                      selectedTopic === topic
                        ? "bg-blue-500 text-white"
                        : "bg-white text-black hover:bg-blue-100"
                    }`}
                    onClick={() => handleTopicSelection(topic)}
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}
            <div className="text-center">
              <button
                type="submit"
                className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                Absenden
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default MitteilungForm;
