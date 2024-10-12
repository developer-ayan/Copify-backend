// Required modules and utilities
const {
  validatorMethod,
  catchErrorValidation,
  delete_file,
  generateClaimCode,
  wrongValueCheck,
} = require("../../../utils/helpers");
const { secret_key, displayDate } = require("../../../utils/static-values");
const AdminUsers = require("../../models/admin/admin-users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Institute = require("../../models/common/institute");
const Department = require("../../models/common/department");
const DeliveryCharges = require("../../models/common/delivery-charges");
const PaperSizes = require("../../models/common/paper-sizes");
const RiderRadius = require("../../models/common/rider-radius");
const PromoCodes = require("../../models/common/promo-codes");
const Extensions = require("../../models/common/extensions");
const Semesters = require("../../models/common/semesters");
const PointIntoPhp = require("../../models/common/point-into-php");
const SubscriptionPlan = require("../../models/common/subscription-plans");
const Users = require("../../models/app/user");
const Subject = require("../../models/app/createPage");
const SubjectFiles = require("../../models/common/subject-file");
const Subscribes = require("../../models/app/subscribe");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validatorMethod({ email, password }, res);

    if (validation) {
      const find = await Users.findOne({ email, role_id: { $in: [1, 2, 3, 4] } });

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
      } else if (find?.account_status == 'inActive') {
        return res.status(200).json({
          status: false,
          message: "Your account has been in Active. Please contact the admin for assistance.",
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
    const { email, password, name, role_id } = req.body;
    const validation = validatorMethod({ email, name, password }, res);
    if (validation) {
      const find = await Users.findOne({ email });
      if (find) {
        res.status(200).json({
          status: false,
          message:
            "An account with this email address is already registered. Please use a different email address to register a new account.",
        });
      } else {
        const created = await Users.create({
          email,
          password,
          name,
          role_id
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

const createBranch = async (req, res) => {
  try {
    const { email, password, name, role_id, branch_address } = req.body;
    const validation = validatorMethod({ email, name, password, role_id, branch_address }, res);
    if (validation) {
      const find = await Users.findOne({ email });
      if (find) {
        res.status(200).json({
          status: false,
          message:
            "An account with this email address is already registered. Please use a different email address to register a new account.",
        });
      } else {
        const created = await Users.create({
          email,
          password,
          name,
          role_id,
          branch_address,
          file_upload: req.file ? req.file.location : null
        });
        if (created) {
          const token = await jwt.sign(
            { user_id: created.user_id, email: created.email },
            secret_key
          );
          created.token = token;
          await created.save();
          res.status(200).json({
            status: true,
            message: "Branch has been created.",
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

const editBranch = async (req, res) => {
  try {
    const { user_id, name, email, password, branch_address } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      // Update the document by ID
      const updated = await Users.findOne({ user_id });
      updated.name = name || updated.name;
      updated.password = password || updated.password;
      updated.branch_address = branch_address || updated.branch_address;
      updated.file_upload = req.file ? req.file.location : updated.file_upload;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Branch update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchBranchList = async (req, res) => {
  try {
    const find = await Users.find({ role_id: "2", account_status: "active" }).lean()
    const modifiedArray = find?.map((item, index) => {
      return { ...item, branch_id: item.user_id }
    })
    res.status(200).json({
      status: true,
      message: "Branch fetch successfully.",
      data: modifiedArray,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const deleted = await Users.findOneAndDelete({ user_id });
      res.status(200).json({
        status: true,
        message: "Branch delete successfully.",
      });
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

const fetchInstituteTeacherAndStudent = async (req, res) => {
  try {
    const { institute_id, role_id } = req.body;
    const validation = validatorMethod({ institute_id, role_id }, res);
    if (validation) {
      const find = await Users.find({ institute_id, role_id }).lean(); // Convert to plain objects to modify safely

      if (find) {
        // Modify array by adding role_type based on role_id
        const modifiedArray = find.map((item) => ({
          ...item,
          role_type: item.role_id === '3' ? 'Student' : 'Teacher',
          claim_code: generateClaimCode(item.user_id)
        }));

        return res.status(200).json({
          status: true,
          message: "Institute users fetched successfully.",
          data: modifiedArray,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "No record found!",
        });
      }
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


const editStatusTeacherAndStudent = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (validation) {
      const updated = await Users.findOne({ user_id });
      updated.account_status = updated.account_status == 'active' ? 'inActive' : 'active';
      updated.token = '';
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Status updated successfully. If set to active or disable, the user will be logged out from the app."
      });
    }
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
    const { user_id, paper_size, black_and_white_paper_size_price, colorful_paper_price } = req.body;
    const validation = validatorMethod({ user_id, paper_size, black_and_white_paper_size_price, colorful_paper_price }, res);


    if (validation) {
      const created = await PaperSizes.create({
        user_id,
        paper_size,
        black_and_white_paper_size_price,
        colorful_paper_price
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
    const { paper_size, paper_size_id, black_and_white_paper_size_price, colorful_paper_price } = req.body;
    const validation = validatorMethod({ paper_size_id }, res);

    if (validation) {
      // Update the document by ID
      const updated = await PaperSizes.findOne({ paper_size_id });
      updated.paper_size = paper_size || updated.paper_size;
      updated.black_and_white_paper_size_price = black_and_white_paper_size_price || updated.black_and_white_paper_size_price;
      updated.colorful_paper_price = colorful_paper_price || updated.colorful_paper_price;
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

const fetchPromoCode = async (req, res) => {
  try {
    const { promo_code } = req.body;
    if (!wrongValueCheck(promo_code)) {
      const find = await PromoCodes.findOne({
        promo_code: { $regex: new RegExp(`^${promo_code.toLowerCase()}`, 'i') }
      });

      if (find) {
        const start_date_promo_code = new Date(find.start_date);
        const end_date_promo_code = new Date(find.end_date);
        const current_date = new Date(); // Convert current date to Date object

        // Check if the start date is in the future
        if (current_date < start_date_promo_code) {
          res.status(200).json({
            status: false,
            message: `This promo code is not valid yet. It will be valid from ${displayDate(start_date_promo_code)} to ${displayDate(end_date_promo_code)}.`,
          });
        }
        // Check if the promo is valid within the start and end date range
        else if (current_date >= start_date_promo_code && current_date <= end_date_promo_code) {
          res.status(200).json({
            status: true,
            message: "Promo code fetched successfully.",
            data: find,
          });
        }
        // If the promo has expired
        else {
          res.status(200).json({
            status: false,
            message: "This promo code has expired.",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Invalid promo code.",
        });
      }
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
        file_upload: req.file ? req.file.location : null,
      },
      res
    );
    if (validation) {
      const created = await Extensions.create({
        user_id,
        extension_name,
        file_upload: req.file ? req.file.location : null,
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
      req.file && delete_file("uploads/", req.file.location);
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

const createPointIntoPhp = async (req, res) => {
  try {
    const { user_id, points, php } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        points,
        php
      },
      res
    );
    if (validation) {
      const created = await PointIntoPhp.create({
        user_id,
        points,
        php
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Point into PHP set successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
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

const editPointIntoPhp = async (req, res) => {
  try {
    const { point_into_php_id, points, php } = req.body;
    const validation = validatorMethod(
      {
        point_into_php_id,
      },
      res
    );

    if (validation) {
      // Update the document by ID
      const updated = await PointIntoPhp.findOne({ point_into_php_id });
      updated.points = points || updated.points;
      updated.php = php || updated.php;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Point into PHP update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchPointIntoPhp = async (req, res) => {
  try {
    const find = await PointIntoPhp.find({});
    res.status(200).json({
      status: true,
      message: "Point into PHP fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createSubscriptionPlan = async (req, res) => {
  try {
    const { user_id, price, month } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        price,
        month
      },
      res
    );
    if (validation) {
      const created = await SubscriptionPlan.create({
        user_id,
        price,
        month
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Subscription plan create successfully.",
          data: created,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
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

const editSubscriptionPlan = async (req, res) => {
  try {
    const { subsrciption_plan_id, price, month } = req.body;
    const validation = validatorMethod(
      {
        subsrciption_plan_id,
      },
      res
    );

    if (validation) {
      // Update the document by ID
      const updated = await SubscriptionPlan.findOne({ subsrciption_plan_id });
      updated.price = price || updated.price;
      updated.month = month || updated.month;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Subscription plan update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteSubscriptionPlan = async (req, res) => {
  try {
    const { subsrciption_plan_id } = req.body;
    const validation = validatorMethod({ subsrciption_plan_id }, res);
    if (validation) {
      const deleted = await SubscriptionPlan.findOneAndDelete({ subsrciption_plan_id });
      res.status(200).json({
        status: true,
        message: "Subscription plan delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchTeacherSubjectPage = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Subject.find({ user_id });
      const modfiedArr = await find?.map((item, index) => {
        return { id: item.subject_id, value: `${item?.subject_description + item.subject_code} - Section ${item.section}` }
      })
      res.status(200).json({
        status: true,
        message: "Subject fetch successfully.",
        data: modfiedArr,
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

const fetchTeacherSubjectFiles = async (req, res) => {
  try {
    const { subject_id, files_type } = req.body;
    const validation = validatorMethod({ subject_id, files_type }, res);
    if (validation) {
      const find = await SubjectFiles.find({ subject_id, publish_or_save: files_type });
      res.status(200).json({
        status: true,
        message: "Subject files fetch successfully.",
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

const deleteTeacherSubjectFiles = async (req, res) => {
  try {
    const { subject_file_id } = req.body;
    const validation = validatorMethod({ subject_file_id }, res);
    if (validation) {
      const deleted = await SubjectFiles.findOneAndDelete({ subject_file_id });
      res.status(200).json({
        status: true,
        message: "File delete successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};


const fetchSubscriptionPlan = async (req, res) => {
  try {
    const find = await SubscriptionPlan.find({});
    res.status(200).json({
      status: true,
      message: "Subscription plan fetch successfully.",
      data: find,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchSubscriberList = async (req, res) => {
  try {
    const { teacher_id, subject_id } = req.body;
    const validation = validatorMethod({ teacher_id, subject_id }, res);
    if (validation) {
      const find = await Subscribes.aggregate([
        {
          $match: {
            teacher_id: Number(teacher_id), // Match documents based on teacher_id
            subject_id: Number(subject_id)
          },
        },
        {
          $lookup: {
            from: "app_users", // Collection to join with
            localField: "user_id", // Field from Subscribes
            foreignField: "user_id", // Field from app_users
            as: "students", // New array field to add
          },
        },
        {
          $unwind: {
            path: "$students", // Unwind the semester array
            preserveNullAndEmptyArrays: true, // Keep documents with no matches
          },
        },
        {
          $replaceRoot: {
            newRoot: "$students", // Replace root with semester document
          },
        },
        {
          $project: {
            _id: 1, // Include _id
            name: 1, // Include name
            email: 1, // Include email
            role_id: 1, // Include role_id
            institute_id: 1, // Include institute_id
            account_status: 1, // Include account_status
            created_at: 1, // Include created_at
            updated_at: 1, // Include updated_at
            user_id: 1, // Include user_id
          },
        },
        {
          $group: {
            _id: null, // Group all documents into a single document
            data: { $push: "$$ROOT" }, // Push each document into a data array
          },
        },
        {
          $project: {
            _id: 0, // Exclude _id
            data: 1, // Include the data array
          },
        },
      ]);

      const modifiedArray = await (find[0]?.data || []).map((item, index) => {
        return {
          ...item,
          user_id: generateClaimCode(item.user_id),
        };
      });

      res.status(200).json({
        status: true,
        message: "Subscribers fetched successfully.",
        data: modifiedArray, // Safeguard against empty result
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


const SearchTeacher = async (req, res) => {
  try {
    const { search } = req.body;

    // Constructing regex based on the input
    const regex = search ? new RegExp(search, "i") : null;

    // Build the $match object to ensure role_id is 3 and apply search if available
    const matchCriteria = {
      role_id: "4", // Only users with role_id 3
      ...(regex ? {
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      } : {}),
    };

    const find = await Users.aggregate([
      {
        $match: matchCriteria,
      },
    ]);

    // If users are found, modify the array
    const modifiedArray = find.map((item) => ({
      ...item,
      claim_number: generateClaimCode(item.user_id),
    }));

    res.status(200).json({
      status: true,
      message: "Students fetched successfully.",
      data: modifiedArray.length > 0 ? modifiedArray : [],
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const SearchStudent = async (req, res) => {
  try {
    const { search } = req.body;

    // Constructing regex based on the input
    const regex = search ? new RegExp(search, "i") : null;

    // Build the $match object to ensure role_id is 3 and apply search if available
    const matchCriteria = {
      role_id: "3", // Only users with role_id 3
      ...(regex ? {
        $or: [
          { name: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      } : {}),
    };

    const find = await Users.aggregate([
      {
        $match: matchCriteria,
      },
    ]);

    // If users are found, modify the array
    const modifiedArray = find.map((item) => ({
      ...item,
      claim_number: generateClaimCode(item.user_id),
    }));

    res.status(200).json({
      status: true,
      message: "Students fetched successfully.",
      data: modifiedArray.length > 0 ? modifiedArray : [],
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};


module.exports = {
  login,
  register,
  createBranch,
  editBranch,
  deleteUser,
  fetchBranchList,
  fetchInstituteList,
  createInstitute,
  editInstitute,
  fetchInstituteDetail,
  fetchInstituteTeacherAndStudent,
  editStatusTeacherAndStudent,
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
  createPointIntoPhp,
  editPointIntoPhp,
  fetchPointIntoPhp,
  createSubscriptionPlan,
  editSubscriptionPlan,
  deleteSubscriptionPlan,
  fetchSubscriptionPlan,
  SearchTeacher,
  SearchStudent,
  fetchTeacherSubjectPage,
  fetchTeacherSubjectFiles,
  deleteTeacherSubjectFiles,
  fetchSubscriberList,
  fetchPromoCode
};
