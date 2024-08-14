const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer().none(); // Middleware for handling multipart/form-data with no files

// Import controllers
const {
  login,
  register,
  createInstitute,
  editInstitute,
  fetchInstituteDetail,
  deleteInstitute,
  fetchInstituteList,
  createDepartment,
  editDepartment,
  deleteDepartment,
  fetchDepartmentList,
  SearchInstitute
} = require("../controllers/admin");

// Import middleware
const { authAdminMiddleware } = require("../middlewares/authMiddleware");

// Authentication routes
router.post("/login", upload, login);
router.post("/register", upload, register);

// Institute routes with authentication middleware
router.post("/create_institute", authAdminMiddleware, upload, createInstitute);
router.post("/edit_institute", authAdminMiddleware, upload, editInstitute);
router.post("/delete_institute", authAdminMiddleware, upload, deleteInstitute);
router.post("/fetch_institute_detail", authAdminMiddleware, upload, fetchInstituteDetail);
router.post("/search_institute", authAdminMiddleware, upload, SearchInstitute);
router.post("/fetch_institute_list", authAdminMiddleware, upload, fetchInstituteList);

// department routes with authentication middleware
router.post("/create_department", authAdminMiddleware, upload, createDepartment);
router.post("/edit_department", authAdminMiddleware, upload, editDepartment);
router.post("/delete_department", authAdminMiddleware, upload, deleteDepartment);
router.post("/fetch_department_list", authAdminMiddleware, upload, fetchDepartmentList);

module.exports = router;
