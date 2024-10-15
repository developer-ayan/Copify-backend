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
  fetchUsers,
  fetchEmailVerifyForRegisteration,
  createSubscribePackage,
  fetchSubscribeSubjectForStudent,
  createRider,
  fetchRiderStatus,
  fetchActivationTime,
  editActivationTime,
  fetchRiderDashboard,
  fetchOrderDetail,
  editOrderStatus,
  fetchRiderRadius,
  deleteTeacherSubject,
  logout,
  createOrderProof,
  fetchOrderProof
} = require("../controllers/app");

// Import middleware
const { authAppMiddleware } = require("../middlewares/authMiddleware");
const fileUpload = require("../../config/file-folder-check");
const { fetchTeacherSubjectPage, fetchSubscriptionPlan, fetchBranchList, fetchPromoCode } = require("../controllers/admin");
const multipleFileUpload = require("../../config/multiple-file-upload");

// Authentication routes
router.post("/login", upload, login);
router.post("/register", upload, register);
router.post("/logout", upload, logout);
router.post("/fetch_verify_email_for_registration", upload, fetchEmailVerifyForRegisteration);
router.post("/create_subscribe_package", upload, createSubscribePackage);

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
  "/delete_subject",
  authAppMiddleware,
  fileUpload,
  deleteTeacherSubject
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
router.post(
  "/fetch_subscribe_subject_for_student",
  authAppMiddleware,
  upload,
  fetchSubscribeSubjectForStudent
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
router.post("/fetch_branch_list", authAppMiddleware, upload, fetchBranchList);

// subscription
router.post(
  "/fetch_subscription_plan_list",
  upload,
  fetchSubscriptionPlan
);


// rider
router.post(
  "/edit_rider_coordinates",
  authAppMiddleware,
  upload,
  EditRiderCoordinates
);
router.post(
  "/edit_rider_status",
  authAppMiddleware,
  upload,
  createRider
);
router.post(
  "/fetch_rider_status",
  authAppMiddleware,
  upload,
  fetchRiderStatus
);
router.post(
  "/fetch_rider_activation_time",
  authAppMiddleware,
  upload,
  fetchActivationTime
);
router.post(
  "/edit_rider_activation_time",
  authAppMiddleware,
  upload,
  editActivationTime
);
router.post(
  "/rider_dashboard",
  authAppMiddleware,
  upload,
  fetchRiderDashboard
);
router.post(
  "/rider_order_detail",
  authAppMiddleware,
  upload,
  fetchOrderDetail
);
router.post(
  "/edit_order_status",
  authAppMiddleware,
  upload,
  editOrderStatus
);
router.post(
  "/fetch_rider_radius",
  authAppMiddleware,
  upload,
  fetchRiderRadius
);
router.post(
  "/send_order_proof",
  authAppMiddleware,
  multipleFileUpload,
  createOrderProof
);
router.post(
  "/fetch_order_proof",
  authAppMiddleware,
  upload,
  fetchOrderProof
);
router.post(
  "/fetch_promo_code",
  authAppMiddleware,
  upload,
  fetchPromoCode
);

module.exports = router;
