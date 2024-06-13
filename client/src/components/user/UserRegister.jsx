import { useNavigate } from "react-router-dom";
import "../../global.css";
import zxcvbn from "zxcvbn";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5500";

const UserRegister = () => {
  const navigate = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    const el = event.target.elements;

    const password = el.password.value;
    const confirmPassword = el.confirmPassword.value;
    const passwordStrength = zxcvbn(password);

    console.log("Password strength score:", passwordStrength.score);

    if (passwordStrength.score < 3) {
      alert(
        "Das Passwort ist zu schwach. Bitte wählen Sie ein stärkeres Passwort."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Die Passwörter stimmen nicht überein.");
      return;
    }

    const body = {
      userName: el.userName.value,
      email: el.email.value,
      password,
      confirmPassword,
    };

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Registration successful:", data);
        event.target.reset();
        alert("Sie haben sich erfolgreich registriert.");
        navigate("/login");
      } else {
        const error = await response.text();
        console.error("Registration failed:", error);
        alert("Registrierung fehlgeschlagen: " + error);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registrierung fehlgeschlagen: " + error.message);
    }
  };

  return (
    <section className="flex justify-center items-center w-full min-h-screen p-2 sm:p-4">
      <div className="relative w-full max-w-md">
        <div className="reusableBorder  shadow-md">
          <form className="space-y-4" onSubmit={submitHandler}>
            <div>
              <h2 className="mb-6 text-3xl font-bold text-center text-white">
                Registrieren
              </h2>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-200"
              >
                Benutzername:
              </label>
              <input
                type="text"
                name="userName"
                id="userName"
                className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
              />
            </div>
            <div className="pt-3">
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
                className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
              />
            </div>
            <div className="pt-3">
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
                className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
              />
            </div>
            <div className="pt-3">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-200"
              >
                Passwort bestätigen:
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="w-full px-4 py-2 mt-1 bg-gray-800 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-white"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 mt-4 bg-yellow-500 rounded-md text-gray-800 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
            >
              Abschicken
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserRegister;
