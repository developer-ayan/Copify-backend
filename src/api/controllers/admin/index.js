// Required modules and utilities
const {
  validatorMethod,
  catchErrorValidation,
} = require("../../../utils/helpers");
const { secret_key } = require("../../../utils/static-values");
const AdminUsers = require("../../models/admin/admin-users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Institute = require("../../models/common/institute");
const Department = require("../../models/common/department");

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
    const { search } = req.body

    if (search) {
      // Constructing regex based on the input
      const regex = new RegExp(search, "i") || null;

      // Build the $match object to search in both fields
      const matchCriteria = {
        $or: [
          { institute_name: { $regex: regex } },
          { institute_location: { $regex: regex } }
        ]
      };
      const find = await Institute.aggregate([
        {
          $match: matchCriteria
        }
      ]);
      if (find) {
        res.status(200).json({
          status: true,
          message: "Institute fetched successfully.",
          data: find
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Institute fetched successfully.",
          data: []
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
    const validation = validatorMethod(
      { institute_id },
      res
    );
    if (validation) {
      const find = await Department.find({ institute_id })
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
  fetchDepartmentList
};
