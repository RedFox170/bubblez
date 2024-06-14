import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext.jsx";
import "../../global.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const UserLogin = () => {
  const { setIsLoggedIn, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const login = async (event) => {
    event.preventDefault();
    const el = event.target.elements;
    const body = {
      email: el.email.value,
      password: el.password.value,
    };

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Wichtig, um Cookies zu senden und zu empfangen
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await response.json();

      setUserData(data.user);
      setIsLoggedIn(true);
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.message); // Setze die Fehlermeldung
    }
  };

  return (
    <section className="flex justify-center items-center w-full min-h-screen p-2 sm:p-4">
      <div className="relative w-full max-w-md">
        <div className="reusableBorder p-4 sm:p-6 rounded-lg shadow-lg">
          <form className="space-y-4" onSubmit={login}>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-center text-white">
                Login
              </h2>
              {errorMessage && (
                <div className="mb-4 text-center text-red-500">
                  {errorMessage}
                </div>
              )}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200"
                >
                  E-Mail:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-gray-500 focus:border-gray-500 text-white"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200"
                >
                  Passwort:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-gray-500 focus:border-gray-500 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-yellow-500 rounded-md text-gray-800 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
              >
                Einloggen
              </button>
              <div className="mt-4 text-center">
                <a
                  href="/forgot-password"
                  className="text-sm text-yellow-500 hover:underline"
                >
                  Passwort vergessen?
                </a>
              </div>
              <div className="mt-2 text-center">
                <a
                  href="/register"
                  className="text-sm text-yellow-500 hover:underline"
                >
                  Noch kein Konto? Registrieren
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserLogin;
