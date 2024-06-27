import UserModell from "../models/userSchema.js";
import bcrypt from "bcrypt";
import { generateToken } from "./jwtController.js";
import jwt from "jsonwebtoken";
import zxcvbn from "zxcvbn";

/******************************************************
 *    registerController
 ******************************************************/

export const registerController = async (req, res) => {
  const { email, password, confirmPassword, userName } = req.body;

  try {
    // Überprüfen, ob die E-Mail bereits existiert
    const existingUser = await UserModell.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Überprüfen, ob das Passwort und die Bestätigung übereinstimmen
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Überprüfen der Passwortstärke
    const passwordStrength = zxcvbn(password);
    if (passwordStrength.score < 3) {
      // Die Skala reicht von 0 (sehr schwach) bis 4 (sehr stark)
      return res.status(400).json({ message: "Password is too weak." });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 12);

    // Neuen Benutzer erstellen und speichern
    const newUser = await UserModell.create({
      email,
      userName,
      password: hashedPassword,
    });

    // Erfolgreiche Registrierung
    res
      .status(201)
      .json({ message: "User successfully registered", user: newUser });
  } catch (error) {
    console.error("Registration failed.", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/******************************************************
 *    loginController
 ******************************************************/
export const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserModell.findOne({ email }).populate("groups");

    if (!user) {
      const error = new Error("Invalid credentials code001");
      error.statusCode = 401;
      throw error;
    }

    // Konvertiere Mongoose-Objekt zu JavaScript-Objekt
    const plainUserObj = user.toObject();
    delete plainUserObj.password;
    delete plainUserObj.groups;
    delete plainUserObj.marketItems;

    // Nur Passwort gelöscht -> Benutzerobjekt für das Frontend
    const userObjOPW = user.toObject();
    delete userObjOPW.password;

    // Kleines Objekt für den JWT-Token (im Cookie)
    const userForJwt = plainUserObj;

    // Generiere ein JWT mit dem `userForJwt`-Objekt als Payload
    const accessToken = jwt.sign({ user: userForJwt }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Setze das Token als Cookie im Antwort-Header
    res.cookie("token", accessToken, {
      httpOnly: true, // Der Cookie kann nicht durch JavaScript im Client ausgelesen werden. Der Server und Browser schicken ihn nur per HTTP hin und zurück. Das ist eine Sicherheitsmaßnahme.
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    // Logging für erfolgreiche Anmeldung
    console.log(`User logged in: ${email}`);

    // Sende die Benutzerdaten (ohne Passwort) zurück an den Client
    res.status(200).json({ user: userObjOPW });
  } catch (error) {
    // Logging für Fehlerfälle
    console.error(`Error during login: ${error.message}`);
    next(error);
  }
};

/******************************************************
 *    logoutController
 ******************************************************/

export const logoutController = (req, res) => {
  console.log("User logged out");
  res.clearCookie("token", {
    path: "/", // Der gleiche Pfad wie beim Setzen des Cookies
    httpOnly: true,
    secure: true, // oder false, wenn nicht über HTTPS
    sameSite: "Strict", // oder je nach Anforderung
  });
  console.log("User logged out");
  res.status(200).json({ message: "Logged out successfully" });
};

/******************************************************
 *    getUserData
 ******************************************************/
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.user._id;
    const user = await UserModell.findById(userId).populate("groups");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

/******************************************************
 *    getUserById (z.B. für Profilansicht)
 ******************************************************/

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModell.findById(req.params.id).populate(
      "followUsers",
      "userName image"
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

/******************************************************
 *    addFriend
 ******************************************************/

export const addFriend = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .send("Authorization failed: JWT token not found in cookie");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const currentUserId = decodedToken.user._id;

    const friendId = req.params.id; // Beachte hier die Änderung

    // Überprüfe, ob der Benutzer sich selbst als Freund hinzufügen möchte
    if (currentUserId === friendId) {
      return res.status(400).send("You cannot add yourself as a friend.");
    }

    // Finde den aktuellen Benutzer
    const currentUser = await UserModell.findById(currentUserId);

    // Überprüfe, ob der Benutzer bereits als Freund hinzugefügt wurde
    if (currentUser.followUsers.includes(friendId)) {
      return res.status(400).send("User is already in your friends list.");
    }

    // Füge den Freund zur Liste hinzu und speichere den Benutzer
    currentUser.followUsers.push(friendId);
    await currentUser.save();

    res.status(200).send({
      message: "Friend added successfully",
      followUsers: currentUser.followUsers,
    });
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).send("Internal Server Error");
  }
};

/******************************************************
 *    editUser
 ******************************************************/
export const editUser = async (req, res, next) => {
  // Extrahiere Felder aus req.body
  const { city, firstName, aboutMe, image = null, ...rest } = req.body;

  // Kopiere das rest Object in structuredObj
  const structuredObj = { ...rest };

  // Füge nur Felder hinzu, die einen Wert haben
  if (city) structuredObj["city"] = city;
  if (firstName) structuredObj["firstName"] = firstName;
  if (aboutMe) structuredObj["aboutMe"] = aboutMe;
  if (typeof image === "string") structuredObj["image"] = image; // Nur Strings zulassen

  // Null bedeutet löschen
  if (city === null) structuredObj["city"] = "";
  if (firstName === null) structuredObj["firstName"] = "";
  if (aboutMe === null) structuredObj["aboutMe"] = "";
  if (image === null) structuredObj["image"] = ""; // Sicherstellen, dass es als String gesetzt wird

  try {
    const userId = req.params.id;
    const options = { new: true };

    console.log("Updating user with data:", structuredObj);

    const user = await UserModell.findByIdAndUpdate(
      userId,
      structuredObj,
      options
    );

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).send({ message: "User successfully edited", user });
  } catch (error) {
    console.error("Error editing user:", error);
    res.status(error.status || 500).send({ message: error.message });
  }
};

/******************************************************
 *    deleteUser
 ******************************************************/

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    await UserModell.findByIdAndDelete(userId);
    res.status(200).send({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};

//done: userSchema erweitern -> geodata: String
//done: Geodaten sollen in DB/LS gespeichert werden
