// Required modules and utilities
const {
  validatorMethod,
  catchErrorValidation,
  delete_file,
  modifiedArray,
  sendNotification,
} = require("../../../utils/helpers");
const { secret_key } = require("../../../utils/static-values");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Institute = require("../../models/common/institute");
const Users = require("../../models/app/user");
const Subject = require("../../models/app/createPage");
const Department = require("../../models/common/department");
const SubjectFiles = require("../../models/common/subject-file");

const fetchInstituteList = async (req, res) => {
  try {
    const find = await Institute.find({});
    if (find) {
      const modfiedArr = await modifiedArray(
        "institute_id",
        "institute_name",
        find
      );
      res.status(200).json({
        status: true,
        message: "Institute fetch successfully.",
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

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validatorMethod({ email, password }, res);

    if (validation) {
      const find = await Users.findOne({ email });

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
          message: "Your account has been in-active. Please contact the admin for assistance.",
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
    const { email, password, name, role_id, institute_id } = req.body;
    const validation = validatorMethod(
      { email, name, role_id, institute_id, password },
      res
    );
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
          institute_id,
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

const teacherDashboard = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Department.aggregate([
        {
          $match: {
            institute_id: 1, // Match the department based on institute_id
          },
        },
        {
          $addFields: {
            // Convert department_id to string for comparison
            department_id_str: { $toString: "$department_id" },
          },
        },
        {
          $lookup: {
            from: "subjects", // The collection to join with
            localField: "department_id_str", // Field from Department, converted to string
            foreignField: "department_id", // Field from Subjects, assumed to be string
            as: "subjects", // The name of the new array field to add to the result
          },
        },
      ]);
      if (find) {
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
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createTeacherPage = async (req, res) => {
  try {
    const {
      user_id,
      department_id,
      section,
      subject_code,
      subject_description,
      semester_id,
      year,
      no_of_enrolled,
    } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        department_id,
        section,
        subject_code,
        subject_description,
        semester_id,
        year,
        no_of_enrolled,
      },
      res
    );
    if (validation) {
      const created = await Subject.create({
        user_id,
        department_id,
        section,
        subject_code,
        subject_description,
        semester_id,
        year,
        no_of_enrolled,
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

const createSubjectFile = async (req, res) => {
  const sendNotificationTitle = (id, title, date, time) => {
    if (id == "1") {
      return `${title} has been uploaded to the Copify app.`;
    } else if (id == "2") {
      return `${title} has been uploaded to the Copify app. However, it is a personal file and will only be visible to you`;
    } else if (id == "3") {
      return `We will publish your file on Copify at this date ${date} and time ${time}.`;
    }
  };
  try {
    const {
      user_id,
      subject_id,
      title,
      description,
      page_number,
      paper_size_id,
      color_code_id,
      total_price,
      publish_or_save,
      time,
      date,
    } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        subject_id,
        file_upload: req.file ? req.file.filename : null,
        title,
        description,
        page_number,
        paper_size_id,
        color_code_id,
        total_price,
        publish_or_save,
      },
      res
    );
    if (validation) {
      const created = await SubjectFiles.create({
        user_id,
        subject_id,
        file_upload: req.file ? req.file.filename : null,
        title,
        description,
        page_number,
        paper_size_id,
        color_code_id,
        total_price,
        publish_or_save,
        time,
        date,
      });
      if (created) {
        sendNotification(
          user_id,
          "File status",
          sendNotificationTitle(publish_or_save, title, date, time)
        );
        res.status(200).json({
          status: true,
          message: "Subject file create successfully.",
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
      // delete_file("/uploads/country_images/", countryCode.country_image);
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const teacherSubjectList = async (req, res) => {
  try {
    const { subject_id } = req.body;
    const validation = validatorMethod({ subject_id }, res);
    if (validation) {
      const find = await SubjectFiles.find({ subject_id });
      if (find) {
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
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

module.exports = {
  login,
  register,
  fetchInstituteList,
  createTeacherPage,
  teacherDashboard,
  createSubjectFile,
  teacherSubjectList,
};
