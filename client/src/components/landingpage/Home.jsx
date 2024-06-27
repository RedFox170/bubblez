import "./home.css";
import { Link } from "react-router-dom";
import "../reuseable/styles/reusableFormComponents.css";
import "../reuseable/styles/reusableGlobal.css";
import Bubblez from "../mainComponents/styling/Bubblez";

const Home = () => {
  return (
    <div className="home-container">
      <Bubblez />
      <section className="relative z-10"></section>
      <section className="style-test w-auto">
        <div className="box">
          <div className="container mx-auto max-w-lg p-6">
            <div className="form">
              <h2 className="text-3xl font-bold mb-4 text-center">
                Herzlich Willkommen bei Bubblez!
              </h2>
              <p className="text-xl mb-6 text-center">
                Bist du bereits Mitglied?{" "}
                <Link
                  to="/login"
                  className="block custom-text-shadow tracking-wide font-bold"
                >
                  Einloggen
                </Link>
              </p>
              <p className="text-xl mb-4 text-center">
                Bist du neu hier?{" "}
                <a
                  href="/register"
                  className="block tracking-wide font-bold custom-text-shadow"
                >
                  Registrieren
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
