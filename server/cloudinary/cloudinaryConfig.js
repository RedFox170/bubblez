import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();
// Hier wird die Cloudinary-Bibliothek konfiguriert, indem die notwendigen Zugangsdaten (cloud_name, api_key, api_secret) aus den Umgebungsvariablen gelesen werden.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Export der konfigurierten Cloudinary-Instanz:
export default cloudinary;
