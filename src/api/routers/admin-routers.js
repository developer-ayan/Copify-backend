const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer().none();

const {
  login,
  register,
  createInstitute,
  editInstitute,
  fetchInstituteDetail,
  deleteInstitute,
} = require("../controllers/admin");
const { authAdminMiddleware } = require("../middlewares/authMiddleware");

router.post("/login", upload, login);
router.post("/register", upload, register);
router.post("/create_institute", authAdminMiddleware, upload, createInstitute);
router.post("/edit_institute", authAdminMiddleware, upload, editInstitute);
router.post("/delete_institute", authAdminMiddleware, upload, deleteInstitute);
router.post(
  "/fetch_institute_detail",
  authAdminMiddleware,
  upload,
  fetchInstituteDetail
);

module.exports = router;
