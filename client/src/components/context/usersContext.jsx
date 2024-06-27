import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { UserContext } from "./userContext";
import apiClient from "./apiClient.js";

export const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [usersData, setUsersData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { setIsLoggedIn } = useContext(UserContext);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="));
    if (token) {
      fetchUsers();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient("/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsersData(data);
      } else if (response.status === 401) {
        handleLogout();
      } else {
        throw new Error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    setUsersData([]);
    setIsLoggedIn(false);
    localStorage.clear();
    window.location.href = "/login";
  }, [setIsLoggedIn]);

  return (
    <UsersContext.Provider
      value={{ usersData, isLoading, clearUsersData: handleLogout }}
    >
      {children}
    </UsersContext.Provider>
  );
};
