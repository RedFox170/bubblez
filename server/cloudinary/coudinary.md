# Cloudinary einrichten

### Schritt 1: Installiere die erforderlichen Pakete

Installiere `express-fileupload` und `cloudinary`:

```bash
npm install express-fileupload cloudinary
```

### Schritt 2: Konfiguriere Cloudinary

Erstelle eine Datei `cloudinaryConfig.js` und konfiguriere Cloudinary:

```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

### Schritt 3: Erstelle eine Middleware für den Dateiupload

Erstelle eine Middleware-Datei `uploadMiddleware.js`:

```javascript
import fileUpload from 'express-fileupload';

const uploadMiddleware = fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
});

export default uploadMiddleware;
```

### Schritt 4: Erstelle einen Controller für den Bildupload

Erstelle einen Controller `imageController.js`:

```javascript
import cloudinary from './cloudinaryConfig.js';

const uploadImage = async (req, res) => {
  try {
    const file = req.files.image;
    const result = await cloudinary.uploader.upload(file.tempFilePath);
    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Image upload failed',
      error: error.message,
    });
  }
};

export { uploadImage };
```

### Schritt 5: Erstelle einen Router für den Bildupload

Erstelle einen Router `imageRouter.js`:

```javascript
import express from 'express';
import uploadMiddleware from './uploadMiddleware.js';
import { uploadImage } from './imageController.js';

const imageRouter = express.Router();

imageRouter.post('/upload', uploadMiddleware, uploadImage);

export default imageRouter;
```

### Schritt 6: Binde den Router in deinem Server ein

Aktualisiere deine `server.js`-Datei:

```javascript
import { fileURLToPath } from 'url';
import path from 'path';

import imageRouter from './routes/imageRouter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


/******************************************************
 * API
 ******************************************************/
...
app.use('/', usersRouter);
app.use('/', imageRouter);

/******************************************************
 *  Statischer Ordner für hochgeladene Dateien
 ******************************************************/

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Schritt 7: in andere Compos einbinden

