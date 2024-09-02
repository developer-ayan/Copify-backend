// Required modules and utilities
const {
  validatorMethod,
  catchErrorValidation,
  delete_file,
} = require("../../../utils/helpers");
const { secret_key } = require("../../../utils/static-values");
const AdminUsers = require("../../models/admin/admin-users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Institute = require("../../models/common/institute");
const Department = require("../../models/common/department");
const Subject = require("../../models/common/subject");
const DeliveryCharges = require("../../models/common/delivery-charges");
const PaperSizes = require("../../models/common/paper-sizes");
const RiderRadius = require("../../models/common/rider-radius");
const PromoCodes = require("../../models/common/promo-codes");
const Extensions = require("../../models/common/extensions");
const Semesters = require("../../models/common/semesters");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validatorMethod({ email, password }, res);

    if (validation) {
      const find = await AdminUsers.findOne({ email });

      if (!find) {
        return res.status(200).json({
          status: false,
          message: "Invalid email or password.",
        });
      }

      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, find.password);

      if (!isMatch) {
        return res.status(200).json({
          status: false,
          message: "Invalid email or password.",
        });
      } else {
        const token = await jwt.sign(
          { user_id: find.user_id, email: find.email },
          secret_key
        );

        // Save the token to the user document
        find.token = token;
        await find.save();

        res.status(200).json({
          status: true,
          message: "Login successful.",
          data: find,
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const validation = validatorMethod({ email, name, password }, res);
    if (validation) {
      const find = await AdminUsers.findOne({ email });
      if (find) {
        res.status(200).json({
          status: false,
          message:
            "An account with this email address is already registered. Please use a different email address to register a new account.",
        });
      } else {
        const created = await AdminUsers.create({
          email,
          password,
          name,
        });
        if (created) {
          const token = await jwt.sign(
            { user_id: created.user_id, email: created.email },
            secret_key
          );
          // Save the token to the user document
          created.token = token;
          await created.save();
          res.status(200).json({
            status: true,
            message: "Account has been created.",
            data: created,
          });
        } else {
          res.status(200).json({
            status: false,
            message: "Something went wrong!",
          });
        }
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createInstitute = async (req, res) => {
  try {
    const { user_id, institute_name, institute_location } = req.body;
    const validation = validatorMethod(
      { user_id, institute_name, institute_location },
      res
    );

    if (validation) {
      const created = await Institute.create({
        user_id,
        institute_name,
        institute_location,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Institute create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editInstitute = async (req, res) => {
  try {
    const { institute_id, institute_name, institute_location } = req.body;
    const validation = validatorMethod({ institute_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await Institute.findOne({ institute_id });
      updated.institute_name = institute_name || updated.institute_name;
      updated.institute_location =
        institute_location || updated.institute_location;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Institute update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchInstituteDetail = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Institute.findOne({ institute_id });
      res.status(200).json({
        status: true,
        message: "Institute fetch successfully.",
        data: find,
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const SearchInstitute = async (req, res) => {
  try {
    const { search } = req.body;

    if (search) {
      // Constructing regex based on the input
      const regex = new RegExp(search, "i") || null;

      // Build the $match object to search in both fields
      const matchCriteria = {
        $or: [
          { institute_name: { $regex: regex } },
          { institute_location: { $regex: regex } },
        ],
      };
      const find = await Institute.aggregate([
        {
          $match: matchCriteria,
        },
      ]);
      if (find) {
        res.status(200).json({
          status: true,
          message: "Institute fetched successfully.",
          data: find,
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Institute fetched successfully.",
          data: [],
        });
      }
    } else {
      const find = await Institute.find({});
      res.status(200).json({
        status: true,
        message: "Institute fetch successfully.",
        data: find,
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchInstituteList = async (req, res) => {
  try {
    const find = await Institute.find({});
    res.status(200).json({
      status: true,
      message: "Institute fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const deleted = await Institute.findOneAndDelete({ institute_id });
      res.status(200).json({
        status: true,
        message: "Institute delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchDepartmentList = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Department.find({ institute_id });
      res.status(200).json({
        status: true,
        message: "Department fetch successfully.",
        data: find,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createDepartment = async (req, res) => {
  try {
    const { user_id, institute_id, department_name } = req.body;
    const validation = validatorMethod(
      { user_id, institute_id, department_name },
      res
    );

    if (validation) {
      const created = await Department.create({
        user_id,
        institute_id,
        department_name,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Department create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editDepartment = async (req, res) => {
  try {
    const { department_id, department_name } = req.body;
    const validation = validatorMethod({ department_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await Department.findOne({ department_id });
      updated.department_name = department_name || updated.department_name;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Department update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteDepartment = async (req, res) => {
  try {
    const { department_id } = req.body;
    const validation = validatorMethod({ department_id }, res);
    if (validation) {
      const deleted = await Department.findOneAndDelete({ department_id });
      res.status(200).json({
        status: true,
        message: "Department delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createSubject = async (req, res) => {
  try {
    const { user_id, institute_id, subject_name } = req.body;
    const validation = validatorMethod(
      { user_id, institute_id, subject_name },
      res
    );

    if (validation) {
      const created = await Subject.create({
        user_id,
        institute_id,
        subject_name,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Subject create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editSubject = async (req, res) => {
  try {
    const { institute_subject_id, subject_name } = req.body;
    const validation = validatorMethod({ institute_subject_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await Subject.findOne({ institute_subject_id });
      updated.subject_name = subject_name || updated.subject_name;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Subject update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { institute_subject_id } = req.body;
    const validation = validatorMethod({ institute_subject_id }, res);
    if (validation) {
      const deleted = await Subject.findOneAndDelete({ institute_subject_id });
      res.status(200).json({
        status: true,
        message: "Subject delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchSubjectList = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Subject.find({ institute_id });
      res.status(200).json({
        status: true,
        message: "Subject fetch successfully.",
        data: find,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createSemester = async (req, res) => {
  try {
    const { user_id, semester_name, department_id } = req.body;
    const validation = validatorMethod(
      { user_id, semester_name, department_id },
      res
    );

    if (validation) {
      const created = await Semesters.create({
        user_id,
        semester_name,
        department_id,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Semester create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editSemester = async (req, res) => {
  try {
    const { semester_id, semester_name } = req.body;
    const validation = validatorMethod({ semester_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await Semesters.findOne({ semester_id });
      updated.semester_name = semester_name || updated.semester_name;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Semester update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteSemester = async (req, res) => {
  try {
    const { semester_id } = req.body;
    const validation = validatorMethod({ semester_id }, res);
    if (validation) {
      const deleted = await Semesters.findOneAndDelete({ semester_id });
      res.status(200).json({
        status: true,
        message: "Semester delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchSemesterList = async (req, res) => {
  try {
    const { department_id } = req.body;
    const validation = validatorMethod({ department_id }, res);
    if (validation) {
      const find = await Semesters.find({ department_id });
      res.status(200).json({
        status: true,
        message: "Semester fetch successfully.",
        data: find,
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Something went wrong!",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createDeliveryCharges = async (req, res) => {
  try {
    const { user_id, delivery_charges } = req.body;
    const validation = validatorMethod({ user_id, delivery_charges }, res);

    if (validation) {
      const created = await DeliveryCharges.create({
        user_id,
        delivery_charges,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Delivery charges set successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editDeliveryCharges = async (req, res) => {
  try {
    const { delivery_charges, _id } = req.body;
    const validation = validatorMethod({ delivery_charges }, res);

    if (validation) {
      // Update the document by ID
      const updated = await DeliveryCharges.findOne({ _id: _id });
      updated.delivery_charges = delivery_charges || updated.delivery_charges;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Delivery charges update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchDeliveryChargesList = async (req, res) => {
  try {
    const find = await DeliveryCharges.find({});
    res.status(200).json({
      status: true,
      message: "Delivery charges fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createPaperSize = async (req, res) => {
  try {
    const { user_id, paper_size } = req.body;
    const validation = validatorMethod({ user_id, paper_size }, res);

    if (validation) {
      const created = await PaperSizes.create({
        user_id,
        paper_size,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Paper size create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editPaperSize = async (req, res) => {
  try {
    const { paper_size, paper_size_id } = req.body;
    const validation = validatorMethod({ paper_size, paper_size_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await PaperSizes.findOne({ paper_size_id });
      updated.paper_size = paper_size || updated.paper_size;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Paper size update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deletePaperSize = async (req, res) => {
  try {
    const { paper_size_id } = req.body;
    const validation = validatorMethod({ paper_size_id }, res);
    if (validation) {
      const deleted = await PaperSizes.findOneAndDelete({ paper_size_id });
      res.status(200).json({
        status: true,
        message: "Paper size delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchPaperSizeList = async (req, res) => {
  try {
    const find = await PaperSizes.find({});
    res.status(200).json({
      status: true,
      message: "Paper size fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createRiderRadius = async (req, res) => {
  try {
    const { user_id, rider_radius } = req.body;
    const validation = validatorMethod({ user_id, rider_radius }, res);

    if (validation) {
      const created = await RiderRadius.create({
        user_id,
        rider_radius,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Rider radius set successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editRiderRadius = async (req, res) => {
  try {
    const { rider_radius_id, rider_radius } = req.body;
    const validation = validatorMethod({ rider_radius_id, rider_radius }, res);

    if (validation) {
      // Update the document by ID
      const updated = await RiderRadius.findOne({ rider_radius_id });
      updated.rider_radius = rider_radius || updated.rider_radius;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Rider radius update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchRiderRadiusList = async (req, res) => {
  try {
    const find = await RiderRadius.find({});
    res.status(200).json({
      status: true,
      message: "Rider radius fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createPromoCode = async (req, res) => {
  try {
    const { user_id, start_date, end_date, promo_code, discount } = req.body;
    const validation = validatorMethod(
      { user_id, start_date, end_date, promo_code, discount },
      res
    );

    if (validation) {
      const created = await PromoCodes.create({
        user_id,
        start_date,
        end_date,
        discount,
        promo_code,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Promo code create successfully.",
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editPromoCode = async (req, res) => {
  try {
    const { promo_code_id, start_date, end_date, promo_code, discount } =
      req.body;
    const validation = validatorMethod({ promo_code_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await PromoCodes.findOne({ promo_code_id });
      updated.start_date = start_date || updated.start_date;
      updated.end_date = end_date || updated.end_date;
      updated.promo_code = promo_code || updated.promo_code;
      updated.discount = discount || updated.discount;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Promo code update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deletePromoCode = async (req, res) => {
  try {
    const { promo_code_id } = req.body;
    const validation = validatorMethod({ promo_code_id }, res);
    if (validation) {
      const deleted = await PromoCodes.findOneAndDelete({ promo_code_id });
      res.status(200).json({
        status: true,
        message: "Promo code delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchPromoCodeList = async (req, res) => {
  try {
    const find = await PromoCodes.find({});
    res.status(200).json({
      status: true,
      message: "Promo codes fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createExtension = async (req, res) => {
  try {
    const { user_id, extension_name } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        extension_name,
        file_upload: req.file ? req.file.filename : null,
      },
      res
    );
    if (validation) {
      const created = await Extensions.create({
        user_id,
        extension_name,
        file_upload: req.file ? req.file.filename : null,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Extension create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    } else {
      req.file && delete_file("uploads/", req.file.filename);
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const editExtension = async (req, res) => {
  try {
    const { extension_id, extension_name, file_upload } = req.body;
    const validation = validatorMethod(
      {
        extension_id,
      },
      res
    );

    if (validation) {
      // Update the document by ID
      const updated = await Extensions.findOne({ extension_id });
      updated.extension_name = extension_name || updated.extension_name;
      updated.file_upload = file_upload || updated.file_upload;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Extension update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteExtension = async (req, res) => {
  try {
    const { extension_id } = req.body;
    const validation = validatorMethod({ extension_id }, res);
    if (validation) {
      const find = await Extensions.findOne({ extension_id });
      if (find) {
        await delete_file("uploads/", find?.file_upload);
        const deleted = await Extensions.findOneAndDelete({ extension_id });
        res.status(200).json({
          status: true,
          message: "Extension delete successfully.",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchExtensionList = async (req, res) => {
  try {
    const find = await Extensions.find({});
    res.status(200).json({
      status: true,
      message: "Extensions fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

module.exports = {
  login,
  register,
  fetchInstituteList,
  createInstitute,
  editInstitute,
  fetchInstituteDetail,
  SearchInstitute,
  deleteInstitute,
  createDepartment,
  editDepartment,
  deleteDepartment,
  fetchDepartmentList,
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
};
