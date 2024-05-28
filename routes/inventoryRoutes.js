import express from "express";
import multer from "multer";
import path from "path";
import {
  addItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../controllers/inventoryController.js";

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

// Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
}).single("image");

const router = express.Router();

router.post("/add", upload, addItem);
router.get("/", getItems);
router.get("/:id", getItemById);
router.put("/:id", upload, updateItem);
router.delete("/:id", deleteItem);

export default router;
