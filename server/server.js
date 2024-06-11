import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
// import session from "express-session";
import userRouter from "./routes/userRouter.js";
import feedRouter from "./routes/feedRouter.js";
import postRouter from "./routes/postRouter.js";
import groupsRouter from "./routes/groupsRouter.js";
import marketRouter from "./routes/marketRouter.js";
import usersRouter from "./routes/usersRouter.js";
import imageRouter from "./cloudinary/imageRouter.js";

//! request loggen mehr loggen

//import userRouter from "./routes/user.js";
dotenv.config();
const app = express();

/******************************************************
 *    __dirname und __filename bereitstellen
 ******************************************************/

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/******************************************************
 *    Mit Mongoose verbinden
 ******************************************************/

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;

const URI = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(URI)
  .then(() => console.log(`MongoDB connected`))
  .catch((error) => console.log(error, "Database did not connect! ☹️❌"));

mongoose.connection.on("error", () => console.log);

app.set("trust proxy", 1);

/******************************************************
 *    Middleware
 ******************************************************/
const allowedOrigins = [
  "http://localhost:5173", // lokale Entwicklungsumgebung
  "http://localhost:5500", // lokale Backend Umgebung
  "https://bubblez.pushgang.de", // Produktions-Frontend
  "https://bubblez.pushgang.de/server", // Produktions-Backend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // erlaube Cookie-Austausch z.B. für Authentifizierung
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

/******************************************************
 * API
 * ******************************************************/

app.use("/", userRouter);
app.use("/", feedRouter);
app.use("/", postRouter);
app.use("/", groupsRouter);
app.use("/", marketRouter);
app.use("/", usersRouter);
app.use("/", imageRouter);

/******************************************************
 *  Statischer Ordner für hochgeladene Dateien
 * ******************************************************/

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/******************************************************
 *   Server starten
 * ******************************************************/

app.listen(5500, () => {
  console.log("Server läuft auf Port 5500");
});
