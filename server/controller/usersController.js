import UserModell from "../models/userSchema.js";

/******************************************************
 *    getAllUsers
 ******************************************************/
//! Ich glaub aktuell wird diese Funktion nicht aufgerufen
export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModell.find().select("userName _id groups image");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).send({
      message: "Fehler beim Abrufen der Benutzerdaten",
      error: error.message,
    });
  }
};
