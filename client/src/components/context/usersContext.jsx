import { createContext, useState, useEffect } from "react";

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5500/users", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsersData(data);
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearUsersData = () => {
    setUsersData([]); // Setze die Userdaten zurück
  };

  return (
    <UsersContext.Provider value={{ usersData, isLoading, clearUsersData }}>
      {children}
    </UsersContext.Provider>
  );
};
