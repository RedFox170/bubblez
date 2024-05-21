import { Link } from "react-router-dom";
import Carousel from "../landingpage/Carousel.jsx";
import "./DashboardStyle.css";
import Logo from "../assets/bubble_icon.png";

const Dashboard = () => {
  return (
    <>
      <section className="relative z-10">
        <Carousel />
      </section>
      <section className="flex  justify-center h-full  w-full">
        <div className="relative">
          <Link
            to="/groups"
            className="reusableSquareDash absolute"
            style={{ "--i": 5 }}
          >
            <div className="square-link text-center font-bold">
              Meine Bubblez
            </div>
          </Link>
          <Link
            to="/feed"
            className="reusableSquareDash absolute"
            style={{ "--i": 6 }}
          >
            <div className="square-link text-center font-bold">Mein Feed</div>
          </Link>
          <Link
            to="/market"
            className="reusableSquareDash absolute"
            style={{ "--i": 7 }}
          >
            <div className="square-link text-center font-bold">Marktplatz</div>
          </Link>
          <Link
            to="/profile"
            className="reusableSquareDash absolute"
            style={{ "--i": 8 }}
          >
            <div className="square-link text-center font-bold">Mein Profil</div>
          </Link>
          <Link
            to="/nachbarn-einladen"
            className="reusableSquareDash absolute"
            style={{ "--i": 9 }}
          >
            <div className="square-link text-center font-bold">
              Freunde einladen
            </div>
          </Link>
        </div>

        <div className="container mt-64">
          <div className="form flex flex-col items-center justify-center h-full">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 text-center">
              Herzlich Willkommen bei Bubblez!
            </h2>
            <img src={Logo} className="h-40 self-center" alt="logo" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
