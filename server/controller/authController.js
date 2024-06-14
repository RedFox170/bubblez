import bcrypt from "bcrypt";
import UserModel from "../models/userSchema.js";
import jwt from "jsonwebtoken";

/******************************************************
 *    authenticateUser
 *    für login
 ******************************************************/
export const authenticateUser = async (req, res, next) => {
  try {
    // 1. Extrahiere Benutzername und Passwort aus dem Anforderungskörper
    const { email, password } = req.body;

    // 2. Suche nach dem Benutzer mit dem angegebenen Benutzernamen in der Datenbank
    const user = await UserModel.findOne({ email });

    // 3. Wenn kein Benutzer mit dem angegebenen Benutzernamen gefunden wurde, sende einen Fehler zurück
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 401; // Unautorisiert
      throw error;
    }

    // 4. Überprüfe, ob das angegebene Passwort mit dem Passwort des Benutzers übereinstimmt
    const match = await bcrypt.compare(password, user.password);

    // 5. Wenn das Passwort nicht übereinstimmt, sende einen Fehler zurück
    if (!match) {
      const error = new Error("Incorrect password");
      error.statusCode = 401; // Unautorisiert
      throw error;
    }

    // 6. Generiere ein JWT-Token für den Benutzer
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 7. Setze das Token als Cookie im Antwort-Header
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Nur in Produktion auf "secure" setzen
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // SameSite-Attribut setzen
    });

    // 8. Wenn alles erfolgreich ist, rufe die nächste Middleware oder den Controller auf
    next();
  } catch (error) {
    next(error); // Weiterleiten des Fehlers an den Fehlerhandler
  }
};

/******************************************************
 *    authorizeUser
 *    wenn der user eingeloggt ist
 ******************************************************/
export const authorizeUser = (req, res, next) => {
  // 1. wir nehmen den jwt aus dem Request
  const token = req.cookies.token;
  console.log("AuthorizeUser token", token);
  // 2. Wenn es keinen token gibt, senden wir einen fehler zurück
  if (!token) {
    console.log("No token found. You are not authorized.");
    return res.status(401).send("No token found. You are not authorized.");
  }
  // 3. wenn es einen token gibt, versuchen wir ihn zu verifizieren
  // 4. bei einem fehler, senden wir einen error zurück
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Invalid token");
      return res.status(401).send("Invalid token");
    }
    console.log("Decoded user:", user);
    // wir wollen den user in der nächsten middleware verwenden.
    req.user = user;
    // console.log("req.user authController", user);
    // 5. wenn alles geklappt hat, führen wir next() aus.
    next();
  });
};
