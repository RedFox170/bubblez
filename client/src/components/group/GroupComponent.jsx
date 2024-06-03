import { Link, useParams } from "react-router-dom";
// import { GroupsContext } from "../context/groupsContext.jsx";
import { useEffect, useState } from "react";
import groupPlaceholderImg from "../assets/groupPlaceholder.jpg";
import { Modal } from "../mainComponents/createPost-Components/Modal.jsx";
import GroupPostCard from "./GroupPostCard.jsx";
import "../reuseable/styles/reusableGlobal.css";
import "../reuseable/styles/reusableFormComponents.css";
import MitteilungForm from "../mainComponents/createPost-Components/MitteilungForm.jsx";
import Avatar from "../../../public/avatar-placeholder.png";

const GroupComponent = () => {
  const { groupId } = useParams();
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupPosts, setGroupPosts] = useState([]);

  /******************************************************
   *    groupsData laden
   ******************************************************/

  const fetchGroupData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5500/getGroupDetails/${groupId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedGroup(data);
        setGroupPosts(data.groupPosts || []);
        console.log("Abruf der Gruppe:", data);
        console.log("Gruppen-Posts:", data.groupPosts || []);
      } else {
        console.error("Fehler beim Laden der Gruppe:", await response.text());
      }
    } catch (error) {
      console.error("Fehler beim Laden der Gruppe:", error);
    }
  };

  // Hole die Daten für die Gruppe beim erstmaligen Laden der Komponente
  useEffect(() => {
    fetchGroupData();
  }, [groupId]);

  if (!selectedGroup) {
    return <div>Lädt die Gruppe...</div>;
  }

  /* *****************************************************
   *    Gruppenkommentare laden (funzt eventuell garnicht?!)
   ******************************************************/
  /*  if (isLoading) {
    return <div>Lädt...</div>; // Zeige eine Ladeanzeige
  }

  if (!groupsData) {
    return <div>Keine Daten verfügbar.</div>;
  }

  const {
     image
  } = group;
 */

  /******************************************************
   *    img
   ******************************************************/
  // ! Cloudenary Anbindung fehlt noch
  const groupImg = () => {
    if (selectedGroup.image === "") {
      return groupPlaceholderImg;
    } else {
      return selectedGroup.image;
    }
  };

  /******************************************************
   *    Formatierte Listen
   ******************************************************/

  const formatUserList = (users) => {
    if (!Array.isArray(users) || users.length === 0) {
      return "Keine Benutzer vorhanden";
    }

    // Für jeden Benutzer ein eigenes JSX-Element zurückgeben
    return users.map((user, index) => (
      <span key={user._id}>
        <Link to={`/profile/${user._id}`} key={user.id} className="user-link">
          {user.userName}
        </Link>
        {index < users.length - 1 && ", "}
      </span>
    ));
  };

  /******************************************************
   *    Details ein und ausblenden
   ******************************************************/
  const detailsHandler = () => {
    setShowDetails(!showDetails);
  };

  /******************************************************
   *    Menü ein und ausblenden
   ******************************************************/

  const menüHandler = () => {
    setMenuOpen(!menuOpen);
    console.log("menuOpen", menuOpen);
  };

  /*   *****************************************************
   *    mods, Admins und Members Namen formatieren
   ******************************************************/

  /******************************************************
   *    privateGroup
   ******************************************************/
  /*   const isPrivate = () => {
    const status = group.privateGroup;
    if (status) {
      return "Private Gruppe";
    } else {
      return "Öffentliche Gruppe";
    }
  }; */

  /******************************************************
   *    Modal (create Post in extra Fenster anzeigen)
   ******************************************************/

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  /******************************************************
   *    Profilpic
   ******************************************************/
  /*   const profilImg = () => {
    if (user.image === undefined || null) {
      return Avatar;
    } else {
      return user.image;
    }
  }; */

  /******************************************************
   *    Gruppe verlassen
   ******************************************************/
  const leaveGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:5500/unfollowGroup/${groupId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response", response, groupId);
      if (response.ok) {
        alert("Du hast die Gruppe erfolgreich verlassen.");
        // Logik um die Ansicht zu aktualisieren oder den Nutzer umzuleiten
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Fehler beim Verlassen der Gruppe:", error);
      alert(
        "Ein Fehler ist aufgetreten beim Versuch, die Gruppe zu verlassen."
      );
    }
  };

  return (
    <section className="relative flex flex-col min-h-screen  ">
      {/* Fest positionierter Hintergrund */}
      <div className="absolute inset-0">
        <div className="fixed reusableGlobalBackground "></div>
        <div className="fixed reusableGlobalBackground "></div>
        <div className="fixed reusableGlobalBackground "></div>
      </div>

      {/* Scrollbarer Inhalts-Container */}
      <div className="reusableBlur w-full h-full overflow-auto min-h-screen">
        {/* Container für die gesamte Gruppenansicht, einschließlich Gruppeninfos und Kommentaren */}
        <div className="mx-auto flex flex-col items-center">
          <Link to={`/groups`}>
            <p className="reusableFormBtn mb-4 text-center">
              Zurück zur Gruppenübersicht
            </p>
          </Link>

          {/* Verwendung der reusableContainer Klasse für den Glassmorphismus-Stil */}
          <div className="reusableContainer  max-w-4xl ">
            <h3 className="reusableH3 text-xl font-semibold mb-4 pb-2 border-b-2 w-full px-4 py-2 mt-5">
              {selectedGroup.title}
            </h3>
            <img
              src={groupImg()}
              alt="Gruppenbild"
              className="object-cover mx-auto mb-4"
              style={{
                maxWidth: "800px",
                maxHeight: "600px",
                width: "100%",
                height: "auto",
              }}
            />

            <div className="flex justify-between mb-4">
              <button
                onClick={detailsHandler}
                className="reusableFormBtn h-10 mr-3"
              >
                {!showDetails ? "Details einblenden" : "Details ausblenden"}
              </button>
              <button
                onClick={menüHandler}
                className="reusableFormBtn h-10 ml-3"
              >
                {!menuOpen ? "Menü öffnen" : "Menü schließen"}
              </button>
            </div>

            {showDetails && (
              <div className="space-y-2">
                <p className="bg-white bg-opacity-50 text-center  p-4 rounded-lg shadow-lg">
                  {selectedGroup.text}
                </p>

                {showDetails && selectedGroup && (
                  <div className="space-y-4 mt-4">
                    <div className="bg-white bg-opacity-10 p-1 rounded-lg shadow">
                      <h4 className="text-lg font-semibold mb-1">Admins</h4>
                      <div>{formatUserList(selectedGroup.admins)}</div>
                    </div>
                    <div className="bg-white bg-opacity-10 p-1 rounded-lg shadow">
                      <h4 className="text-lg font-semibold mb-1">Mods</h4>
                      <div>{formatUserList(selectedGroup.mods)}</div>
                    </div>
                    <div className="bg-white bg-opacity-10 p-1 rounded-lg shadow">
                      <h4 className="text-lg font-semibold mb-1">Mitglieder</h4>
                      <div>{formatUserList(selectedGroup.members)}</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {menuOpen && (
              <div className="space-y-2">
                <p className="bg-white bg-opacity-50 text-center  p-4 rounded-lg shadow-lg">
                  Gruppen Einstellungen
                </p>

                <div className="space-y-4 mt-4">
                  <button className="reusableFormBtn h-10 mr-3">
                    Einladen {/* Wenn SocketIo angeschlossen ist */}
                  </button>
                  <button className="reusableFormBtn h-10 mr-3">
                    Inhalt melden{/* Wenn SocketIo angeschlossen ist */}
                  </button>
                  <button
                    onClick={leaveGroup}
                    className="reusableFormBtn h-10 mr-3"
                  >
                    Gruppe verlassen
                  </button>
                  <button className="reusableFormBtn h-10 mr-3">
                    Admin zugang
                  </button>
                </div>
              </div>
            )}

            {/* Tags und Privatsphäre-Status */}
            <div className="p-2 flex justify-between">
              <span>{selectedGroup.tags}</span>
            </div>
          </div>
        </div>

        {/* Sektion für neue Nachricht */}
        <section onClick={openModal} className=" my-4">
          <div className="reusableHeaderBar mx-auto max-w-3xl p-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg shadow-lg flex items-center space-x-4">
            <img
              src={Avatar}
              alt="Profilbild Nutzer"
              className="rounded-full w-14 h-14 object-cover"
            />
            <input
              type="text"
              className="flex-grow  border border-white-500 p-2 rounded-lg focus:ring-2"
              placeholder="Schreib ein Kommentar..."
            />
          </div>
        </section>
        {isModalOpen && (
          <Modal onClose={closeModal}>
            <MitteilungForm
              closeModal={closeModal}
              groupId={groupId}
              setGroupPosts={setGroupPosts}
              groupPosts={groupPosts}
            />
          </Modal>
        )}

        {/* Container für die Post-Karten (Kommentare) innerhalb des gleichen scrollbaren Containers */}
        <div className="mt-4 px-4 md:px-0 max-w-3xl mx-auto">
          {groupPosts
            .slice()
            .reverse()
            .map((post, index) => (
              <GroupPostCard key={post._id || index} post={post} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default GroupComponent;
