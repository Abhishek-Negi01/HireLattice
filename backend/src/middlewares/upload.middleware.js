import multer from "multer";

const ALLOWED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed: PDF, DOCX, ZIP`,
      ),
      false,
    );
  }
};

// Memory storage — buffer is processed before Cloudinary upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB per file
  fileFilter,
});

const zipUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB for ZIP
  fileFilter,
});

// Wraps multer to send clean JSON errors instead of Express default
const wrap = (multerFn) => (req, res, next) => {
  multerFn(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE")
        return res
          .status(400)
          .json({ success: false, message: "File too large. Max 10 MB." });
      if (err.code === "LIMIT_FILE_COUNT")
        return res
          .status(400)
          .json({ success: false, message: "Too many files." });
    }
    return res.status(400).json({ success: false, message: err.message });
  });
};

export const uploadSingle = wrap(upload.single("resume"));
export const uploadBulk = wrap(upload.array("resumes", 50));
export const uploadZip = wrap(zipUpload.single("zip"));
