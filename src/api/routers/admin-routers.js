const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer().none(); // Middleware for handling multipart/form-data with no files
const fileUpload = require("../../config/file-folder-check");

// Import controllers
const {
  login,
  register,
  createInstitute,
  editInstitute,
  fetchInstituteDetail,
  fetchInstituteTeacherAndStudent,
  editStatusTeacherAndStudent,
  deleteInstitute,
  fetchInstituteList,
  createDepartment,
  editDepartment,
  deleteDepartment,
  fetchDepartmentList,
  SearchInstitute,
  createSubject,
  editSubject,
  deleteSubject,
  fetchSubjectList,
  createDeliveryCharges,
  editDeliveryCharges,
  fetchDeliveryChargesList,
  createPaperSize,
  editPaperSize,
  deletePaperSize,
  fetchPaperSizeList,
  createRiderRadius,
  editRiderRadius,
  fetchRiderRadiusList,
  createPromoCode,
  editPromoCode,
  deletePromoCode,
  fetchPromoCodeList,
  createExtension,
  editExtension,
  deleteExtension,
  fetchExtensionList,
  createSemester,
  editSemester,
  deleteSemester,
  fetchSemesterList,
  createPointIntoPhp,
  editPointIntoPhp,
  fetchPointIntoPhp,
  createSubscriptionPlan,
  editSubscriptionPlan,
  deleteSubscriptionPlan,
  fetchSubscriptionPlan,
  SearchTeacher,
  fetchTeacherSubjectPage,
  fetchTeacherSubjectFiles,
  deleteTeacherSubjectFiles,
  fetchSubscriberList
} = require("../controllers/admin");

// Import middleware
const { authAdminMiddleware } = require("../middlewares/authMiddleware");
const { SendMessages, fetchInboxList, fetchMessagesList } = require("../controllers/app");

// Authentication routes
router.post("/login", upload, login);
router.post("/register", upload, register);

// Institute routes with authentication middleware
router.post("/create_institute", authAdminMiddleware, upload, createInstitute);
router.post("/edit_institute", authAdminMiddleware, upload, editInstitute);
router.post("/delete_institute", authAdminMiddleware, upload, deleteInstitute);
router.post(
  "/fetch_institute_detail",
  authAdminMiddleware,
  upload,
  fetchInstituteDetail
);
router.post("/search_institute", authAdminMiddleware, upload, SearchInstitute);
router.post(
  "/fetch_institute_list",
  authAdminMiddleware,
  upload,
  fetchInstituteList
);
router.post("/fetch_institute_teacher_and_student_list", authAdminMiddleware, upload, fetchInstituteTeacherAndStudent);
router.post("/edit_status_teacher_and_student", authAdminMiddleware, upload, editStatusTeacherAndStudent);

// department routes with authentication middleware
router.post(
  "/create_department",
  authAdminMiddleware,
  upload,
  createDepartment
);
router.post("/edit_department", authAdminMiddleware, upload, editDepartment);
router.post(
  "/delete_department",
  authAdminMiddleware,
  upload,
  deleteDepartment
);
router.post(
  "/fetch_department_list",
  authAdminMiddleware,
  upload,
  fetchDepartmentList
);

// subject routes with authentication middleware
router.post("/create_subject", authAdminMiddleware, upload, createSubject);
router.post("/edit_subject", authAdminMiddleware, upload, editSubject);
router.post("/delete_subject", authAdminMiddleware, upload, deleteSubject);
router.post(
  "/fetch_subject_list",
  authAdminMiddleware,
  upload,
  fetchSubjectList
);

// delivery charges routes with authentication middleware
router.post(
  "/create_delivery_charges",
  authAdminMiddleware,
  upload,
  createDeliveryCharges
);
router.post(
  "/edit_delivery_charges",
  authAdminMiddleware,
  upload,
  editDeliveryCharges
);
router.post(
  "/fetch_delivery_charges_list",
  authAdminMiddleware,
  upload,
  fetchDeliveryChargesList
);

// delivery charges routes with authentication middleware
router.post("/create_paper_size", authAdminMiddleware, upload, createPaperSize);
router.post("/edit_paper_size", authAdminMiddleware, upload, editPaperSize);
router.post("/delete_paper_size", authAdminMiddleware, upload, deletePaperSize);
router.post(
  "/fetch_paper_size_list",
  authAdminMiddleware,
  upload,
  fetchPaperSizeList
);

// rider readius charges routes with authentication middleware
router.post(
  "/create_rider_radius",
  authAdminMiddleware,
  upload,
  createRiderRadius
);
router.post("/edit_rider_radius", authAdminMiddleware, upload, editRiderRadius);
router.post(
  "/fetch_rider_radius_list",
  authAdminMiddleware,
  upload,
  fetchRiderRadiusList
);

// promo codes routes with authentication middleware
router.post("/create_promo_code", authAdminMiddleware, upload, createPromoCode);
router.post("/edit_promo_code", authAdminMiddleware, upload, editPromoCode);
router.post("/delete_promo_code", authAdminMiddleware, upload, deletePromoCode);
router.post(
  "/fetch_promo_code_list",
  authAdminMiddleware,
  upload,
  fetchPromoCodeList
);

// extensions routes with authentication middleware
router.post(
  "/create_extension",
  authAdminMiddleware,
  fileUpload,
  createExtension
);
router.post("/edit_extension", authAdminMiddleware, fileUpload, editExtension);
router.post("/delete_extension", authAdminMiddleware, upload, deleteExtension);
router.post(
  "/fetch_extension_list",
  authAdminMiddleware,
  upload,
  fetchExtensionList
);

// semester routes with authentication middleware
router.post("/create_semester", authAdminMiddleware, upload, createSemester);
router.post("/edit_semester", authAdminMiddleware, upload, editSemester);
router.post("/delete_semester", authAdminMiddleware, upload, deleteSemester);
router.post(
  "/fetch_semester_list",
  authAdminMiddleware,
  upload,
  fetchSemesterList)
// point into php routes with authentication middleware
router.post(
  "/create_point_into_php",
  authAdminMiddleware,
  fileUpload,
  createPointIntoPhp
);
router.post("/edit_point_into_php", authAdminMiddleware, fileUpload, editPointIntoPhp);
router.post(
  "/fetch_point_into_php_list",
  authAdminMiddleware,
  upload,
  fetchPointIntoPhp
);

// subscription plans routes with authentication middleware
router.post(
  "/create_subscription_plan",
  authAdminMiddleware,
  fileUpload,
  createSubscriptionPlan
);
router.post("/edit_subscription_plan", authAdminMiddleware, fileUpload, editSubscriptionPlan);
router.post(
  "/delete_subscription_plan",
  authAdminMiddleware,
  upload,
  deleteSubscriptionPlan
);
router.post(
  "/fetch_subscription_plan_list",
  authAdminMiddleware,
  upload,
  fetchSubscriptionPlan
);

// teacher dashboard routes with authentication middleware
router.post(
  "/search_teacher",
  authAdminMiddleware,
  upload,
  SearchTeacher
);
router.post(
  "/fetch_teacher_subject_list",
  upload,
  fetchTeacherSubjectPage
);
router.post(
  "/fetch_teacher_subject_file_list",
  authAdminMiddleware,
  upload,
  fetchTeacherSubjectFiles
);
router.post(
  "/delete_teacher_subject_file_list",
  authAdminMiddleware,
  upload,
  deleteTeacherSubjectFiles
);
router.post(
  "/fetch_teacher_subscriber_list",
  authAdminMiddleware,
  upload,
  fetchSubscriberList
);

router.post(
  "/send_message",
  authAdminMiddleware,
  upload,
  SendMessages
);
router.post(
  "/fetch_messages_list",
  authAdminMiddleware,
  upload,
  fetchMessagesList
);
router.post(
  "/fetch_inbox_list",
  authAdminMiddleware,
  upload,
  fetchInboxList
);

module.exports = router;
