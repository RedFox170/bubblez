import { Link } from "react-router-dom";
import Avatar from "../../../public/avatar-placeholder.png";

const MarketCard = ({ item }) => {
  const showPriceSpaces = (num) => {
    let strNumber = num.toString();
    return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  /******************************************************
   *    Profilpic
   ******************************************************/

  //userdaten für das ProfilBild
  const user = JSON.parse(localStorage.getItem("userData"));

  const profilImg = () => {
    if (user.image === undefined || user.image === null || user.image === "") {
      return Avatar;
    } else {
      return user.image;
    }
  };

  return (
    <div className="reusableBorder p-2 flex flex-col w-full max-w-[380px] hover:scale-105 transition-transform duration-300">
      <div className="text-center">
        <p className="text-xl font-semibold mb-2 underline decoration-solid">
          Angebot: {item.title}
        </p>
        <div className="w-full h-48 mb-4 overflow-hidden rounded-md flex items-center justify-center">
          <img
            className="w-full max-w-[200px] object-cover"
            src={item.image}
            alt="Produktbild"
          />
        </div>

        <p className="mb-4">Beschreibung: {item.description}</p>
        {item.price ? (
          <p className="text-lg font-bold text-red-500">{item.price} €</p>
        ) : (
          <p className="text-lg font-bold text-green-500">Gratis</p>
        )}
        <div className="flex items-center justify-center mt-4">
          Kategorie:
          <span className="ml-2 px-3 py-1 border border-blue-500 text-blue-500 rounded-full bg-blue-100">
            {item.offerType}
          </span>
        </div>

        {/* Ersteller anzeigen und verlinken */}
        {item.creator && (
          <div className="flex justify-between items-center mt-4">
            <Link
              to={`/profile/${item.creator._id}`}
              className="flex items-center hover:cursor-pointer"
            >
              <img
                src={profilImg()}
                alt="Profilbild"
                className="h-10 w-10 rounded-full"
              />
              <div className="text-base ml-4 font-semibold text-gray-900 dark:text-gray-100">
                {item.creator.userName}
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketCard;
