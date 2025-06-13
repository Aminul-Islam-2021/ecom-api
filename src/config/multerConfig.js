import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|avif|webp/; // Allowed filetypes
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

// Initialize upload middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Cleanup function to delete uploaded files if needed
export const cleanUpFiles = (files) => {
  if (!files) return;

  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Failed to delete file: ${file.path}`);
      });
    });
  } else if (typeof files === "object") {
    Object.values(files)
      .flat()
      .forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error(`Failed to delete file: ${file.path}`);
        });
      });
  }
};

export const uploadFields = [{ name: "images", maxCount: 5 }];

for (let i = 0; i < 10; i++) {
  uploadFields.push({ name: `variants[${i}][colorImage]`, maxCount: 1 });
}
