const multer = require("multer");
const path = require("path");

// Set up local disk storage (required for Multer even if you upload to Cloudinary afterwards)
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Allowed file types: images & documents
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|pdf|doc|docx/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExt.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type. Allowed: JPEG, PNG, PDF, DOC, DOCX"));
  }
};

module.exports = multer({ storage, fileFilter });
