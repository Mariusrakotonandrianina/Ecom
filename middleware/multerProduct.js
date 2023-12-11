//importation du multer
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

//pour utiliser __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//le dictionnaire des MIME TYPES
const MIME_TYPES = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

//destination du fichier et generer nom fichier unique
const storage = multer.diskStorage({
  // Destination de stockage du fichier
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "../../front/public/images/imgProduct"));
  },
  filename: (req, file, callback) => {
    // Supprimer les espaces dans le nom du fichier
    const name = file.originalname.replace(/\s/g, "_");
    const extension = MIME_TYPES[file.mimetype];
    // Utilisez "." pour séparer le nom de l'extension
    callback(null, name + "_" + Date.now() + "." + extension);
  },
});

//exportation du middleware multerAvatar
const uploadProduct = multer({ storage }).single("avatar");
export default uploadProduct;
