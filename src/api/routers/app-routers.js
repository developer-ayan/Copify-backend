const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer().none(); // Middleware for handling multipart/form-data with no files

const {
  fetchInstituteList,
  login,
  register,
  fetchDepartmentList,
  fetchSemesterList,
  createTeacherPage,
  teacherDashboard,
  createSubjectFile,
  teacherSubjectList,
  createSubscribeSubjectForStudent,
  fetchSubscriberList,
  notificationList,
  fetchCartSubjectFileList,
  createAddress,
  fetchAddressList,
  editDefaultAddress,
  EditRiderCoordinates,
  fetchPaperSizeList,
  fetchRiderDropDown,
  fetchTeacherSubjectFiles,
  editWalletTopup,
  fetchTransactions,
  createPlaceOrder,
  fetchOrderList,
  deleteTeacherSubjectFiles,
  SendMessages,
  fetchMessagesList,
  fetchInboxList,
  fetchUsers
} = require("../controllers/app");

// Import middleware
const { authAppMiddleware } = require("../middlewares/authMiddleware");
const fileUpload = require("../../config/file-folder-check");
const { fetchTeacherSubjectPage } = require("../controllers/admin");

// Authentication routes
router.post("/login", upload, login);
router.post("/register", upload, register);

// Institute routes with authentication middleware
router.post("/fetch_institute_list", upload, fetchInstituteList);

// Teacher routes with authentication middleware
router.post(
  "/create_teacher_page",
  authAppMiddleware,
  upload,
  createTeacherPage
);
router.post("/teacher_dashboard", authAppMiddleware, upload, teacherDashboard);
router.post(
  "/create_subject_file",
  authAppMiddleware,
  fileUpload,
  createSubjectFile
);
router.post(
  "/fetch_teacher_subject_list",
  upload,
  fetchTeacherSubjectPage
);
router.post(
  "/teacher_subject_list",
  authAppMiddleware,
  upload,
  teacherSubjectList
);
router.post(
  "/teacher_subject_file_list",
  authAppMiddleware,
  upload,
  fetchTeacherSubjectFiles
);
router.post(
  "/delete_subject_file",
  authAppMiddleware,
  upload,
  deleteTeacherSubjectFiles
);
router.post(
  "/fetch_department_list",
  authAppMiddleware,
  upload,
  fetchDepartmentList
);
router.post(
  "/fetch_semester_list",
  authAppMiddleware,
  upload,
  fetchSemesterList
);
router.post(
  "/fetch_subscriber_list",
  authAppMiddleware,
  upload,
  fetchSubscriberList
);
router.post(
  "/send_message",
  authAppMiddleware,
  upload,
  SendMessages
);
router.post(
  "/fetch_messages_list",
  authAppMiddleware,
  upload,
  fetchMessagesList
);
router.post(
  "/fetch_inbox_list",
  authAppMiddleware,
  upload,
  fetchInboxList
);

// Student routes with authentication middleware
router.post(
  "/create_subscribe_subject_for_student",
  authAppMiddleware,
  upload,
  createSubscribeSubjectForStudent
);

// Common routes with authentication middleware
router.post(
  "/fetch_notification_list",
  authAppMiddleware,
  upload,
  notificationList
);
router.post(
  "/fetch_cart_subject_file_list",
  authAppMiddleware,
  upload,
  fetchCartSubjectFileList
);
router.post("/create_address", authAppMiddleware, upload, createAddress);
router.post("/fetch_address_list", authAppMiddleware, upload, fetchAddressList);
router.post(
  "/edit_default_address",
  authAppMiddleware,
  upload,
  editDefaultAddress
);
router.post("/fetch_paper_size_list", authAppMiddleware, upload, fetchPaperSizeList);
router.post("/fetch_riders_list", authAppMiddleware, upload, fetchRiderDropDown);
router.post("/edit_wallet_topup", authAppMiddleware, upload, editWalletTopup);
router.post("/fetch_transaction_list", authAppMiddleware, upload, fetchTransactions);
router.post("/create_place_order", authAppMiddleware, upload, createPlaceOrder);
router.post("/fetch_order_list", authAppMiddleware, upload, fetchOrderList);
router.post("/fetch_users_list", authAppMiddleware, upload, fetchUsers);

// rider
router.post(
  "/edit_rider_coordinates",
  authAppMiddleware,
  upload,
  EditRiderCoordinates
);

module.exports = router;
