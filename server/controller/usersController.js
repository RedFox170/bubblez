import UserModell from "../models/userSchema.js";

/******************************************************
 *    getAllUsers
 ******************************************************/
//! Ich glaub aktuell wird diese Funktion nicht aufgerufen
export const getAllUsers = async (req, res) => {
  console.log("userController löst aus!!!");
  try {
    const users = await UserModell.find().select("userName _id groups image");
    console.log("Alle Benutzerdaten:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      message: "Fehler beim Abrufen der Benutzerdaten",
      error: error.message,
    });
  }
};
