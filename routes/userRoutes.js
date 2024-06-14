import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  requestCode,
  validateCode,
  resetPassword,
} from "../controllers/userController.js";
import multer from "multer";
import path from "path";

// Set storage engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const router = express.Router();

router.post("/register", upload, registerUser);
router.post("/login", loginUser);
router.post("/request-code", requestCode);
router.post("/validate-code", validateCode);
router.post("/reset-password", resetPassword);
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", upload, updateUser);
router.delete("/:id", deleteUser);

export default router;
