
import multer from "multer";
import path from 'path';
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define the destination directory
        const uploadDir = path.join(__dirname, "../..", "public", "images", req?.params?.timestamId.toString());

        // Ensure the directory exists, create it if it doesn't
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Set the destination for Multer
        cb(null, uploadDir);
    },

    /*    destination: function (req, file, cb) {
           cb(null, "public");
       }, */
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
});

const upload = multer({ storage: storage });

export default upload;