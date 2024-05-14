import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Avatar from "/avatar-icon.jpg";

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:5500/users/${userId}`);
        const data = await res.json();
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const profilImg = () => {
    if (!userData?.image) {
      return Avatar;
    } else {
      return userData.image;
    }
  };

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

  return (
    <section className="flex justify-center min-h-screen w-full p-4">
      <div className="relative w-full max-w-4xl bg-white shadow-md p-6 rounded-lg">
        <div className="col-span-full flex flex-col items-center mb-6">
          <div className="profile-image mb-4">
            <img
              src={profilImg()}
              alt="Profile"
              className="w-[150px] h-[150px] object-cover rounded-full"
            />
          </div>
          <h3 className="text-2xl font-bold">{userData.userName}</h3>
          <p className="text-gray-600">{userData.firstName}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">Geburtstag:</h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.birthday
                ? formatDate(userData.birthday)
                : "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">Crew:</h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.crew || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">Stadt:</h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.city || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">Interessen:</h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.interests || "Nicht angegeben"}
            </p>
          </div>
          <div className="md:col-span-1 col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">
              Familienstand:
            </h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.familyStatus || "Nicht angegeben"}
            </p>
          </div>
          <div className="col-span-full">
            <h4 className="block text-gray-700 font-bold mb-1">Über mich:</h4>
            <p className="border rounded-md p-2 bg-gray-50">
              {userData.aboutMe || "Nicht angegeben"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
