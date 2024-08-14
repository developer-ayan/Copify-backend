const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer().none(); // Middleware for handling multipart/form-data with no files

const {
  fetchInstituteList,
  login,
  register,
  createTeacherPage,
  teacherDashboard,
  createSubjectFile,
  teacherSubjectList
} = require("../controllers/app");

// Import middleware
const { authAppMiddleware } = require("../middlewares/authMiddleware");
const fileUpload = require("../../config/file-folder-check");

// Authentication routes
router.post("/login", upload, login);
router.post("/register", upload, register);

// Institute routes with authentication middleware
router.post("/fetch_institute_list", upload, fetchInstituteList);

// Teacher routes with authentication middleware
router.post("/create_teacher_page", authAppMiddleware, upload, createTeacherPage);
router.post("/teacher_dashboard", authAppMiddleware, upload, teacherDashboard);
router.post("/create_subject_file", authAppMiddleware, fileUpload, createSubjectFile);
router.post("/teacher_subject_list", authAppMiddleware, fileUpload, teacherSubjectList);

module.exports = router;
