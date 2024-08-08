// Models
const Users = require("../../models/auth/users");

// Helper Functions
const { delete_file, validatorMethod } = require("../../../utils/helpers");

// ObjectId
const { ObjectId } = require("mongodb");

// Login function
const login = async (req, res) => {
  try {
    const { country_code_id, phone, notification_token } = req.body;
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// Register function
const register = async (req, res) => {
  try {
    const { name, phone, email, country_code_id, notification_token } =
      req.body;
    // const validation = validatorMethod(name, phone);
    // res.status(200).json({
    //   status: false,
    //   message: "tesitng",
    // });
  } catch (error) {
    console.error(error);
    res.status(200).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
};
