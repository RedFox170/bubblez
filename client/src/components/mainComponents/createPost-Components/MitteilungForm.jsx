import { useState } from "react";
import "../../reuseable/styles/reusableFormComponents.css";
import "../../reuseable/styles/reusableGlobal.css";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const MitteilungForm = ({ closeModal, groupId, setGroupPosts, groupPosts }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const handleTopicSelection = (topic) => {
    setSelectedTopic(topic);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "title") setTitle(value);
    if (name === "text") setText(value);
  };

  /******************************************************
   *    Cloudinary
   ******************************************************/

  // Bild-Upload übernimmt jetzt handleChange
  /* const handleImageUpload = (e) => {
    const image = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadImg(reader.result);
    };
    reader.readAsDataURL(image);
  }; */

  /******************************************************
   *    Senden des Forms
   * und überprüfung der Länge des Betreffs und der Nachricht
   ******************************************************/

  const validateAndSubmitForm = async (event) => {
    event.preventDefault();

    // Validierung für 'Betreff'
    if (title.length < 2 || title.length > 50) {
      setErrorMessage("Der Betreff muss zwischen 2 und 50 Zeichen lang sein.");
      return;
    }

    // Validierung für 'Nachricht'
    if (text.length < 2 || text.length > 5000) {
      setErrorMessage(
        "Die Nachricht muss zwischen 2 und 5000 Zeichen lang sein."
      );
      return;
    }

    // Fortfahren mit dem Senden der Daten
    setErrorMessage(""); // Vorherige Fehlermeldungen bereinigen

    const formData = {
      title,
      text,
      topic: selectedTopic,
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
        closeModal(); // Schließt das Modal nach dem Absenden
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
    <section className="flex mb-12 justify-center items-center min-h-screen w-full">
      <div className="reusableGlobalBackground2 absolute"></div>
      <div className="reusableGlobalBackground2 absolute"></div>
      <div className="reusableGlobalBackground2 absolute"></div>
      <div className="relative">
        <div className="reusableSquare absolute" style={{ "--i": 0 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 1 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 2 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 3 }}></div>
        <div className="reusableSquare absolute" style={{ "--i": 4 }}></div>
        <div className="reusableContainer  reusableBorder mt-12 shadow-md">
          <form
            onSubmit={validateAndSubmitForm}
            className="reusableForm space-y-4"
          >
            <header className="flex justify-between items-center border-b pb-2">
              <h2 className="text-xl font-semibold">Wähle eine Option:</h2>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
                onClick={closeModal} // Verwende diese Funktion zum Schließen des Modal/Formular
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
              <div className="flex justify-between">
                <ul className="flex justify-between w-full space-x-2">
                  {/* Themenauswahl */}
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
              <div className="text-center">
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 border border-gray-300 rounded-md bg-black-500 text-black hover:bg-gray-600"
                >
                  Absenden
                </button>
              </div>
            </section>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MitteilungForm;
