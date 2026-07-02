import multer from "multer";

const ALLOWED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/zip",
  "application/x-zip-compressed",
];

const CSV_MIMES = ["text/csv", "application/csv", "text/plain"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIMES.includes(file.mimetype)) cb(null, true);
  else
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed: PDF, DOCX, ZIP`,
      ),
      false,
    );
};

const csvFilter = (req, file, cb) => {
  if (CSV_MIMES.includes(file.mimetype) || file.originalname.endsWith(".csv"))
    cb(null, true);
  else cb(new Error("Only CSV files are allowed for dataset upload"), false);
};

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter,
});
const zipUploadMulter = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});
const datasetUploadMulter = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: csvFilter,
});

const wrap = (multerFn) => (req, res, next) => {
  multerFn(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE")
        return res
          .status(400)
          .json({ success: false, message: "File too large." });
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
export const uploadZip = wrap(zipUploadMulter.single("zip"));
export const uploadDataset = wrap(datasetUploadMulter.single("dataset"));
