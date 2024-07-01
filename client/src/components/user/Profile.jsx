import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Avatar from "/avatar-icon.jpg";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  /******************************************************
   *    fetchUserData
   ******************************************************/
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`${API_URL}/users/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await res.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  /******************************************************
   *    freunde hinzufügen
   ******************************************************/

  const addFriend = async () => {
    try {
      const res = await fetch(`${API_URL}/addFriend/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to add friend");
      }
      const data = await res.json();
      console.log("Friend added:", data);
      // Aktualisiere den Benutzerzustand oder zeige eine Erfolgsmeldung an
    } catch (error) {
      console.error("Error adding friend:", error);
    }
  };

  /******************************************************
   *    Profilbild
   ******************************************************/
  const profilImg = () => {
    if (!userData?.image) {
      return Avatar;
    } else {
      return userData.image;
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
   *    Datum Formatieren
   ******************************************************/

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>Benutzerdaten konnten nicht geladen werden.</p>;
  }

  /******************************************************
   *  Return
   ******************************************************/
  return (
    <section className="flex mt-20 justify-center min-h-screen w-full p-4">
      <div className="relative w-full max-w-4xl shadow-md p-6 rounded-lg reusableContainer">
        <div className="col-span-full flex flex-col items-center mb-6">
          <div className="profile-image mb-4">
            <img
              src={profilImg()}
              alt="Profile"
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
          </div>
          <h3 className="text-2xl font-bold dark:text-gray-100">
            {userData.userName}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {userData.firstName}
          </p>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <button className="reusableFormBtn" onClick={addFriend}>
            Adden
          </button>
          <button className="reusableFormBtn">Nachricht senden</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Geburtstag:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.birthday
                ? formatDate(userData.birthday)
                : "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Crew:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.crew || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Stadt:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.city || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Interessen:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.interests || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Familienstand:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.familyStatus || "Nicht angegeben"}
            </p>
          </div>
          <div className="col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Über mich:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.aboutMe || "Nicht angegeben"}
            </p>
          </div>
          <div className="col-span-full">
            <h4 className="block text-gray-300 dark:text-gray-200 font-bold mb-1">
              Freunde:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50 text-gray-800">
              {userData.followUsers.length > 0
                ? formatUserList(userData.followUsers)
                : "Noch keine Freunde geaddet."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
