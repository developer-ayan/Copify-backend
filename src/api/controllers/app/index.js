// Required modules and utilities
const {
  validatorMethod,
  catchErrorValidation,
  delete_file,
  modifiedArray,
  sendNotification,
  getValueById,
  generateClaimCode,
  toFixedMethod,
  saveTransaction,
  generateTransactionId,
  walletHandler,
  generateChatRoomId,
  wrongValueCheck,
} = require("../../../utils/helpers");
const {
  secret_key,
  SEMESTERS,
  riderAccountStatus,
  activation_array,
  orderStatus,
} = require("../../../utils/static-values");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Institute = require("../../models/common/institute");
const Users = require("../../models/app/user");
const Subject = require("../../models/app/createPage");
const Department = require("../../models/common/department");
const SubjectFiles = require("../../models/common/subject-file");
const Semesters = require("../../models/common/semesters");
const Subscribes = require("../../models/app/subscribe");
const Notification = require("../../models/common/notification");
const DeliveryCharges = require("../../models/common/delivery-charges");
const Address = require("../../models/common/address");
const PaperSizes = require("../../models/common/paper-sizes");
const RiderRadius = require("../../models/common/rider-radius");
const Wallet = require("../../models/common/wallet");
const Transaction = require("../../models/common/transaction");
const Order = require("../../models/app/order");
const Chat = require("../../models/common/chat");
const BuySubscription = require("../../models/app/buy-subscription");
const SubscriptionPlan = require("../../models/common/subscription-plans");
const RiderActivation = require("../../models/app/rider-activation");
const OrderProof = require("../../models/app/order-proof");

const fetchInstituteList = async (req, res) => {
  try {
    const find = await Institute.find({}).sort({ institute_name: 1 });
    if (find) {
      const modfiedArr = await modifiedArray(
        "institute_id",
        "institute_name",
        find,
        true
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
    const { email, password, notification_token } = req.body;
    const validation = validatorMethod({ email, password }, res);

    if (validation) {
      const find = await Users.findOne({ email });

      if (!find) {
        return res.status(200).json({
          status: false,
          message: "Invalid email or password.",
        });
      }

      find.notification_token = notification_token || "";
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, find.password);

      if (!isMatch) {
        return res.status(200).json({
          status: false,
          message: "Invalid email or password.",
        });
      } else if (find?.account_status == "inActive") {
        return res.status(200).json({
          status: false,
          message:
            "Your account has been in-active. Please contact the admin for assistance.",
        });
      } else {
        const token = await jwt.sign(
          { user_id: find.user_id, email: find.email },
          secret_key
        );
        find.claim_no = generateClaimCode(find.user_id);
        find.claim_number = generateClaimCode(find.user_id);
        find.token = token;
        await find.save();

        const userResponse = find.toObject();
        userResponse.claim_number = generateClaimCode(find.user_id);

        res.status(200).json({
          status: true,
          message: "Login successful.",
          data: userResponse,
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const logout = async (req, res) => {
  try {
    const { user_id } = req.body;
    const find = await Users.findOne({ user_id });
    if (find) {
      find.notification_token = null;
      await find.save();
      res.status(200).json({
        status: true,
        message: "Logout successfully",
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

const register = async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      contact_number,
      role_id,
      institute_id,
      semester_id,
      department_id,
      year_level,
      notification_token,
    } = req.body;
    const validation = validatorMethod(
      {
        email,
        name,
        role_id,
        contact_number,
        institute_id,
        password,
      },
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
          contact_number,
          role_id,
          institute_id,

          semester_id,
          department_id,
          year_level,
          notification_token,
        });
        if (created) {
          const token = await jwt.sign(
            { user_id: created.user_id, email: created.email },
            secret_key
          );
          // Save the token to the user document
          created.token = token;
          await created.save();
          const userResponse = created.toObject();
          userResponse.claim_no = generateClaimCode(created.user_id);
          res.status(200).json({
            status: true,
            message: "Account has been created.",
            data: userResponse,
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

const fetchEmailVerifyForRegisteration = async (req, res) => {
  try {
    const { email } = req.body;
    const validation = validatorMethod({ email }, res);
    if (validation) {
      const find = await Users.findOne({ email });
      if (find) {
        res.status(200).json({
          status: false,
          message: "Please use a different email; this one is already in use.",
        });
      } else {
        res.status(200).json({
          status: true,
          message: "Now you can proceed.",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const createSubscribePackage = async (req, res) => {
  try {
    const {
      user_id,
      subsrciption_plan_id,
      amount,
      card_number,
      year,
      month,
      cvv,
    } = req.body;
    const validation = validatorMethod(
      { user_id, subsrciption_plan_id, amount, card_number, year, month, cvv },
      res
    );
    if (validation) {
      const find = await SubscriptionPlan.findOne({ subsrciption_plan_id });
      if (find) {
        const created = await BuySubscription.create({
          user_id,
          subsrciption_plan_id,
        });
        if (created) {
          const credit = await walletHandler({
            user_id,
            transactionType: "credit",
            amount,
          });
          if (credit?.status) {
            const debit = await walletHandler({
              user_id,
              transactionType: "debit",
              amount,
              transaction_reason: `Your account has been debited as you have purchased a ${find?.month}-month subscription plan.`,
            });
            if (debit?.status) {
              res.status(200).json({
                status: true,
                message: `Your account has been debited as you have purchased a ${find?.month}-month subscription plan.`,
              });
            } else {
              res.status(200).json(credit);
            }
          } else {
            res.status(200).json(credit);
          }
        } else {
          res.status(200).json({
            status: false,
            message: "Something went wrong when you buy subsription plan!",
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Subsciption plan not found!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const EditRiderCoordinates = async (req, res) => {
  try {
    const { user_id, latitude, longitude } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const updated = await Users.findOne({ user_id });
      updated.location.coordinates =
        [parseFloat(latitude), parseFloat(longitude)] ||
        updated.location.coordinates;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Rider coordinates update successfully.",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const teacherDashboard = async (req, res) => {
  try {
    const { institute_id, user_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    const institute_detail = await Institute.findOne({ institute_id });

    if (validation) {
      const find = await Department.aggregate([
        {
          $match: {
            institute_id: Number(institute_id), // Match the department based on institute_id
          },
        },
        {
          $addFields: {
            department_id_str: { $toString: "$department_id" }, // Convert department_id to string for lookup
          },
        },
        {
          $lookup: {
            from: "subjects", // Join with subjects collection
            localField: "department_id_str", // Match by department_id string
            foreignField: "department_id", // department_id in subjects
            as: "semester", // Store the result in 'semester' field
          },
        },
        {
          $unwind: "$semester", // Unwind the semester array
        },
        {
          $lookup: {
            from: "app_users", // Join with users collection
            localField: "semester.user_id", // Match by user_id in semester
            foreignField: "user_id", // user_id in users collection
            as: "user_info", // Store the result in 'user_info' field
          },
        },
        {
          $unwind: "$user_info", // Unwind the user_info array
        },
        {
          $addFields: {
            "semester.name": "$user_info.name", // Add user name to semester
            "semester.department_name": "$department_name", // Add user name to semester
          },
        },
        {
          $group: {
            _id: "$_id", // Group back to the original department structure
            department_id: { $first: "$department_id" },
            user_id: { $first: "$user_id" },
            institute_id: { $first: "$institute_id" },
            department_name: { $first: "$department_name" }, // Add department details
            created_at: { $first: "$created_at" }, // Add department details
            updated_at: { $first: "$updated_at" }, // Add department details
            department_id_str: { $first: "$department_id_str" },
            semester: { $push: "$semester" }, // Rebuild the semester array
          },
        },
        {
          $sort: {
            created_at: -1, // Sort by created_at descending, so newer departments come first
          },
        },
      ]);

      if (find.length > 0) {
        const modifiedArray = await Promise.all(
          find.map(async (item, index) => {
            return {
              ...item,
              semester: await Promise.all(
                item.semester.map(async (e) => {
                  const findSubscribers = await Subscribes.findOne({
                    user_id: user_id,
                    subject_id: e.subject_id,
                  });

                  return {
                    ...e,
                    semester_name: getValueById(
                      SEMESTERS,
                      Number(e.semester_id)
                    ),
                    is_subscribed: findSubscribers?.user_id ? true : false,
                  };
                })
              ),
            };
          })
        );

        res.status(200).json({
          status: true,
          message: "Department fetched successfully.",
          data: modifiedArray,
          institute_detail,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "No departments found for the given institute.",
        });
      }
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
      const find = await Department.find({ institute_id }).sort({ department_name: 1 });
      const modfiedArr = await modifiedArray(
        "department_id",
        "department_name",
        find
      );
      res.status(200).json({
        status: true,
        message: "Department fetch successfully.",
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

const fetchSemesterList = async (req, res) => {
  try {
    const { department_id } = req.body;
    const validation = validatorMethod({ department_id }, res);
    if (validation) {
      const find = await Semesters.find({ department_id });
      const modfiedArr = await modifiedArray(
        "semester_id",
        "semester_name",
        find
      );
      res.status(200).json({
        status: true,
        message: "Semester fetch successfully.",
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
      subject_id,
      subject_edit,
    } = req.body;
    if (subject_edit == "true") {
      const updated = await Subject.findOne({ subject_id });
      updated.department_id = department_id || updated.department_id;
      updated.section = section || updated.section;
      updated.subject_code = subject_code || updated.subject_code;
      updated.semester_id = semester_id || updated.semester_id;
      updated.year = year || updated.semester_id;
      updated.no_of_enrolled = no_of_enrolled || updated.no_of_enrolled;
      await updated.save();
      res.status(200).json({
        status: true,
        message: "Subject update successfully.",
        data: updated,
      });
    } else {
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
        sendNotification(
          user_id,
          "Page alert",
          `You have created the subject page ${subject_description}.`
        );
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
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchSubscriberList = async (req, res) => {
  try {
    const { teacher_id } = req.body;
    const validation = validatorMethod({ teacher_id }, res);
    if (validation) {
      const find = await Subscribes.aggregate([
        {
          $match: {
            teacher_id: Number(teacher_id), // Match documents based on teacher_id
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

const fetchSubscriberedList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Subscribes.aggregate([
        {
          $match: {
            user_id: Number(user_id), // Match documents based on teacher_id
          },
        },
        {
          $lookup: {
            from: "subjects", // Collection to join with
            localField: "subject_id", // Field from Subscribes
            foreignField: "subject_id", // Field from app_users
            as: "students", // New array field to add
          },
        },
      ]);

      res.status(200).json({
        status: true,
        message: "Subscribers fetched successfully.",
        data: find, // Safeguard against empty result
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
        file_upload: req.file ? req.file.location : null,
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
      // const created = true
      const created = await SubjectFiles.create({
        user_id,
        subject_id,
        file_upload: req.file ? req.file.location : null,
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
        // sendNotification(
        //   user_id,
        //   "File status",
        //   sendNotificationTitle(publish_or_save, title, date, time)
        // );
        const findUser = await Users.findOne({ user_id });
        if (findUser) {
          const find = await Subscribes.aggregate([
            {
              $match: {
                teacher_id: Number(user_id), // Match documents based on teacher_id
              },
            },
            {
              $lookup: {
                from: "app_users", // Collection to join with
                localField: "user_id", // Field from Subscribes
                foreignField: "user_id", // Field from app_users
                as: "users", // New array field to add
              },
            },
            // {
            //   $unwind: "$users", // Unwind the users array to work with individual user documents
            // },
            // {
            //   $project: {
            //     _id: 0, // Exclude the _id field from the output
            //     notification_token: "$users.notification_token", // Include only the notification_token field
            //   },
            // },
          ]);

          // Extract notification tokens
          // const tokens = find
          //   .map(item => item.users.length > 0 && item.users[0].notification_token) // Check if users exists and has notification_token
          const tokens = find
            .flatMap(
              (item) => item.users.map((user) => user.notification_token) // Map to get notification tokens
            )
            .filter((token) => token !== null); // Filter out null values

          const uniqueTokens = [
            ...new Set(tokens.filter((token) => token !== null)),
          ];
          console.log(uniqueTokens);
          console.log("find", find);
          res.status(200).json({
            status: true,
            message: "Subject file create successfully.",
            data: uniqueTokens,
          });
          if (uniqueTokens.length) {
            sendNotification(
              user_id,
              "New File Upload",
              sendNotificationTitle(publish_or_save, title, date, time),
              true,
              uniqueTokens
            );
          }
        } else {
          res.status(200).json({
            status: true,
            message: "Subject file create successfully.",
            data: created,
          });
        }
      } else {
        res.status(200).json({
          status: false,
          message: "Something went wrong!",
        });
      }
    } else {
      req.file && delete_file("uploads/", req.file.location);
      // delete_file("/uploads/country_images/", countryCode.country_image);
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const deleteTeacherSubject = async (req, res) => {
  try {
    const { subject_id } = req.body;
    const validation = validatorMethod({ subject_id }, res);
    if (validation) {
      const find = await SubjectFiles.find({ subject_id }).sort({ title: 1 });
      if (find.length > 0) {
        res.status(200).json({
          status: false,
          message:
            "In this subject, you already have a file associated, which is why you cannot delete it.",
        });
      } else {
        const deleted = await Subject.findOneAndDelete({ subject_id });
        res.status(200).json({
          status: true,
          message: "Subject delete successfully.",
        });
      }
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
      const find = await SubjectFiles.find({ subject_id }).sort({ title: 1 });
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

const fetchTeacherSubjectFiles = async (req, res) => {
  try {
    const { user_id, publish_or_save } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await SubjectFiles.find({ user_id, publish_or_save }).sort({ title: 1 });
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

// Common controllers with authentication middleware

const notificationList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Notification.find({ user_id })
        .sort({ createdAt: -1 }) // Sort in descending order (latest first)
      if (find) {
        res.status(200).json({
          status: true,
          message: "Notification fetch successfully.",
          data: find,
        });
        sendNotification(24, "Copify update", "Please update application");
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

// Student controllers with authentication middleware

const createSubscribeSubjectForStudent = async (req, res) => {
  try {
    const { teacher_id, user_id, subject_id } = req.body;
    const validation = validatorMethod(
      { teacher_id, user_id, subject_id },
      res
    );
    if (validation) {
      // Check if a subscription already exists
      const existingSubscription = await Subscribes.findOne({
        teacher_id,
        user_id,
        subject_id,
      });

      if (existingSubscription) {
        // If subscription exists, delete it
        await Subscribes.deleteOne({
          teacher_id,
          user_id,
          subject_id,
        });

        res.status(200).json({
          status: true,
          message: `Subject unsubscribed successfully.`,
        });

        sendNotification(
          user_id,
          "Subscribe alert",
          `UnSubscribed successfully.`
        );
      } else {
        // If subscription does not exist, create it
        const created = await Subscribes.create({
          teacher_id,
          user_id,
          subject_id,
        });

        if (created) {
          res.status(200).json({
            status: true,
            message: "Subscribed successfully.",
          });
          sendNotification(
            user_id,
            "Subscribe alert",
            `Subject subscribed successfully.`
          );
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

const fetchSubscribeSubjectForStudent = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Subscribes.find({ user_id }).sort({ createdAt: -1 }).lean();

      if (find.length > 0) {
        const modifiedArray = await Promise.all(
          find.map(async (item) => {
            const subject = await Subject.findOne({
              subject_id: item.subject_id,
            });

            if (subject) {
              return {
                ...item,
                subject_name: `${subject.subject_description} ${subject.subject_code} - Section ${subject.section}`,
              };
            } else {
              // Handle the case where subject is not found
              return {
                ...item,
                subject_name: "Subject not found",
              };
            }
          })
        );

        res.status(200).json({
          status: true,
          message: "Subscribe subject fetch successfully.",
          data: modifiedArray,
        });
      } else {
        res.status(200).json({
          status: false,
          message: "No subscriptions found.",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchCartSubjectFileList = async (req, res) => {
  try {
    const { subject_file_ids } = req.body;
    const validation = validatorMethod({ subject_file_ids }, res);
    if (validation) {
      const find = await SubjectFiles.find({
        subject_file_id: { $in: JSON.parse(subject_file_ids) },
      }).sort({ title: 1 });
      const fetchDeliveryCharges = await DeliveryCharges.findOne({});
      const deliveryCharges = fetchDeliveryCharges?.delivery_charges || 0;
      const totalPriceReduce = await find.reduce(
        (sum, file) => parseFloat(sum) + parseFloat(file.total_price),
        0
      );

      res.status(200).json({
        status: true,
        message: "Cart fetch successfully.",
        data: find,
        sub_total: totalPriceReduce || 0,
        delivery_charges: deliveryCharges || 0,
        total_price: totalPriceReduce + deliveryCharges || 0,
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

const createAddress = async (req, res) => {
  try {
    const { address, title, contact_number, user_id } = req.body;
    const validation = validatorMethod(
      { address, title, contact_number, user_id },
      res
    );
    if (validation) {
      // Check if a subscription already exists
      const existing = await Address.findOne({
        user_id,
      });

      if (existing) {
        // If subscription exists, delete it
        await Address.create({
          address,
          default_select: false,
          contact_number,
          title,
          user_id,
        });

        res.status(200).json({
          status: true,
          message: "Address create successfully.",
        });
      } else {
        // If subscription does not exist, create it
        const created = await Address.create({
          address,
          default_select: true,
          contact_number,
          title,
          user_id,
        });
        if (created) {
          res.status(200).json({
            status: true,
            message: "Address create successfully.",
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

const fetchAddressList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Address.find({ user_id }).sort({ title: 1 });
      if (find) {
        res.status(200).json({
          status: true,
          message: "Address fetch successfully.",
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

const editDefaultAddress = async (req, res) => {
  try {
    const { user_id, address_id } = req.body;
    const validation = validatorMethod({ user_id, address_id }, res);
    if (!validation) {
      return;
    }
    await Address.updateMany(
      { user_id: user_id },
      { $set: { default_select: false } }
    );
    const updatedAddress = await Address.findOneAndUpdate(
      { user_id: user_id, address_id: Number(address_id) },
      { $set: { default_select: true } },
      { new: true }
    );
    if (updatedAddress) {
      res.status(200).json({
        status: true,
        message: "Address updated successfully.",
      });
    } else {
      res.status(200).json({
        status: false,
        message: "Address not found!",
      });
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchPaperSizeList = async (req, res) => {
  try {
    const find = await PaperSizes.find({}).lean();
    const modfiedArr = await modifiedArray(
      "paper_size_id",
      "paper_size",
      find,
      true
    );
    res.status(200).json({
      status: true,
      message: "Paper size fetch successfully.",
      data: modfiedArr,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchUsers = async (req, res) => {
  try {
    const { role_id } = req.body;

    // Validate role_id
    const validation = validatorMethod({ role_id }, res);
    if (validation) {
      // Find users by role_id
      const find = await Users.find({ role_id }).sort({ name: 1 }).lean();

      // Modify the array as per your requirements
      const modifiedArr = await modifiedArray("user_id", "name", find);

      // Send successful response
      res.status(200).json({
        status: true,
        message: "Users fetched successfully.",
        data: modifiedArr,
      });
    }
  } catch (error) {
    // Handle errors
    catchErrorValidation(error, res);
  }
};

const fetchRiderDropDown = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const validation = validatorMethod({ latitude, longitude }, res);
    if (validation) {
      // Convert kilometers to radians (5 km / Earth's radius in kilometers)
      const riderRadius = await RiderRadius.findOne({});
      const radiusInKm = parseFloat(riderRadius?.rider_radius) || 5;
      const earthRadiusInKm = 6378.1;

      const find = await Users.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(latitude), Number(longitude)],
            },
            distanceField: "distance",
            maxDistance: radiusInKm * 1000, // Convert kilometers to meters
            spherical: true,
            query: {
              role_id: "3",
              rider_status_for_student: riderAccountStatus?.activate,
            },
          },
        },
      ]);

      const modifiedArray = find?.map((item) => {
        const price = parseFloat(item.distance) * 10; // Price ko distance se multiply karein
        return {
          user_id: item.user_id,
          name: item.name,
          distance: toFixedMethod(item.distance),
          price: toFixedMethod(price),
        };
      });

      res.status(200).json({
        status: true,
        message: "Riders fetched successfully.",
        data: modifiedArray,
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

const editWalletTopup = async (req, res) => {
  try {
    const {
      user_id,
      amount,
      card_number,
      year,
      month,
      cvv,
      is_admin,
      recharge,
      transfer,
      opposite_user_id,
      withdraw,
    } = req.body;

    // Admin wallet handling
    if (is_admin) {
      if (withdraw) {
        const response = await walletHandler({
          user_id,
          transactionType: "debit",
          amount,
          transaction_reason: `You have withdrawn ${toFixedMethod(amount)} PHP`,
        });
        return res.status(200).json(response);
      }
      // Handling recharge
      if (recharge) {
        const response = await walletHandler({
          user_id,
          transactionType: "credit",
          amount,
          transaction_reason: `You have recharged ${toFixedMethod(
            amount
          )} PHP to your wallet.`,
        });
        return res.status(200).json(response);
      }

      // Handling transfer
      if (transfer) {
        const findFrom = await Users.findOne({ user_id });
        const findTo = await Users.findOne({ user_id: opposite_user_id });

        // Debit from sender
        await walletHandler({
          user_id,
          transactionType: "debit",
          amount,
          transaction_reason: `You have sent ${toFixedMethod(amount)} PHP to ${findTo?.name
            }.`,
          res: res,
        });

        // Credit to receiver
        const creditResponse = await walletHandler({
          user_id: opposite_user_id,
          transactionType: "credit",
          amount,
          transaction_reason: `You have received ${toFixedMethod(
            amount
          )} PHP from ${findFrom?.name}.`,
          res: res,
        });

        if (!creditResponse.status) {
          return res.status(200).json(creditResponse);
        }

        return res.status(200).json({
          status: true,
          message: `${amount} PHP has been transferred successfully.`,
        });
      }
    }

    // Non-admin wallet handling
    else {
      const validation = validatorMethod(
        { user_id, amount, card_number, year, month, cvv },
        res
      );
      if (validation) {
        const response = await walletHandler({
          user_id,
          transactionType: "credit",
          amount,
        });

        if (response) {
          return res.status(200).json(response);
        } else {
          return res.status(200).json({
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

const createPlaceOrder = async (req, res) => {
  try {
    const {
      user_id,
      rider_id,
      subject_file_ids,
      self_pickup,
      address_id,
      rider_charges,
      sub_total,
      total_price,
      transaction_type,
      branch_id,
      priority,
    } = req.body;
    const validation = validatorMethod(
      {
        user_id,
        rider_id,
        subject_file_ids,
        address_id,
        sub_total,
        total_price,
        transaction_type,
      },
      res
    );

    if (transaction_type == "wallet") {
      const find = await Wallet.findOne({ user_id });
      if (find) {
        const currentWalletAmount = parseFloat(find?.amount);
        const totalPrice = parseFloat(total_price);

        // Check if the current wallet amount is less than the total price
        if (currentWalletAmount < totalPrice) {
          return res.status(200).json({
            status: false,
            message: `You need to top up ${toFixedMethod(
              totalPrice - currentWalletAmount
            )} PHP.`,
          });
        } else {
          const response = await walletHandler({
            user_id,
            transactionType: "debit",
            amount: total_price,
            transaction_reason:
              "You have placed the order. This is the amount that has been debited.",
          });
          if (response?.status == true) {
            const created = await Order.create({
              user_id,
              rider_id,
              subject_file_ids,
              self_pickup,
              address_id,
              order_status: "pending",
              branch_id,
              rider_charges,
              sub_total,
              total_price,
              transaction_id: response?.data?.transaction_id,
              priority,
            });
            if (created) {
              res.status(200).json({
                status: true,
                message: "Order Place successfully.",
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
        }
      } else {
        res.status(200).json({
          status: false,
          message: `You need to top up ${toFixedMethod(total_price)} PHP.`,
        });
      }
    }

    if (validation) {
      const response = await walletHandler({
        user_id,
        transactionType: "debit",
        amount: total_price,
        transaction_reason:
          "You have placed the order. This is the amount that has been debited.",
      });
      const created = await Order.create({
        user_id,
        rider_id,
        subject_file_ids,
        self_pickup,
        address_id,
        order_status: "pending",
        branch_id,
        rider_charges,
        sub_total,
        total_price,
        transaction_id: response?.data?.transaction_id,
        priority,
      });
      if (created) {
        res.status(200).json({
          status: true,
          message: "Order Place successfully.",
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

const EditPlaceBranchOrder = async (req, res) => {
  try {
    const {
      branch_id,
      order_id
    } = req.body;
    const validation = validatorMethod(
      {
        branch_id,
        order_id
      },
      res
    );

    if (validation) {
      // Find users by role_id
      const find = await Order.findOne({ order_id })
      find.branch_id = branch_id
      await find.save()

      res.status(200).json({
        status: true,
        message: "Branch select successfully.",
        data: find,
      });
    }
  } catch (error) {
    // Handle errors
    catchErrorValidation(error, res);
  }
};

const EditPlaceRiderOrder = async (req, res) => {
  try {
    const {
      rider_id,
      order_id
    } = req.body;
    const validation = validatorMethod(
      {
        rider_id,
        order_id
      },
      res
    );

    if (validation) {
      // Find users by role_id
      const find = await Order.findOne({ order_id })
      const findUser = await Order.findOne({ user_id: find.rider_id })
      find.rider_id = rider_id
      await find.save()

      res.status(200).json({
        status: true,
        message: "Transfer order successfully.",
        data: find,
      });

      sendNotification(
        rider_id,
        "Order Status",
        `${findUser?.name} has transferred his order to you.`
      );
    }
  } catch (error) {
    // Handle errors
    catchErrorValidation(error, res);
  }
};

const fetchOrderList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Order.find({ user_id })
        .sort({ created_at: -1 })
        .lean();
      const modifiedArray = find?.map((item, index) => {
        return {
          ...item,
          original_order_id: item.order_id,
          order_id: generateClaimCode(item.order_id, "ORD#"),
        };
      });
      res.status(200).json({
        status: true,
        message: "Order fetch successfully.",
        data: modifiedArray,
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

const fetchTransactions = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Wallet.aggregate([
        {
          $match: {
            user_id: user_id, // Match the wallet based on user_id
          },
        },
        {
          $lookup: {
            from: "transactions", // The collection to join with
            localField: "user_id", // Field from Wallet
            foreignField: "user_id", // Field from Transactions
            as: "transactions", // The name of the new array field to add to the result
          },
        },
        {
          $unwind: "$transactions", // Deconstruct the transactions array
        },
        {
          $sort: { "transactions.created_at": -1 }, // Sort transactions in descending order based on created_at
        },
        {
          $group: {
            _id: "$_id", // Group by Wallet's _id
            user_id: { $first: "$user_id" }, // Include user_id
            amount: { $first: "$amount" }, // Include wallet amount
            transactions: { $push: "$transactions" }, // Reconstruct transactions array with sorted transactions
          },
        },
      ]);
      res.status(200).json({
        status: true,
        message: "Transaction fetch successfully.",
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

const SendMessages = async (req, res) => {
  try {
    const { user_id, opposite_user_id, message } = req.body;
    const validation = validatorMethod(
      { user_id, opposite_user_id, message },
      res
    );
    const createdAt = new Date().toISOString();
    if (!validation) return;
    const room_id = await generateChatRoomId(user_id, opposite_user_id);
    const find = await Chat.findOne({ room_id });
    const user = await Users.findOne({ user_id: opposite_user_id });
    if (find) {
      const parseMessage = JSON.parse(find.messages);
      parseMessage.push({ message, user_id, created_at: createdAt });
      find.last_message = message || find.last_message;
      find.messages = JSON.stringify(parseMessage);
      await find.save();
      sendNotification(
        opposite_user_id,
        "Copify Chat",
        `You have received a message from ${user?.name || ""}: ${message}.`
      );
    } else {
      const created = await Chat.create({
        last_message: message,
        messages: JSON.stringify([{ message, user_id, created_at: createdAt }]),
        room_id,
        user_id_1: user_id,
        user_id_2: opposite_user_id,
      });
      if (created) {
        sendNotification(
          opposite_user_id,
          "Copify Chat",
          `You have received a message from ${user?.name || ""}: ${message}.`
        );
      }
    }

    res.status(200).json({
      status: true,
      message: "Send message successfully.",
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchMessagesList = async (req, res) => {
  try {
    const { user_id, opposite_user_id } = req.body;
    const validation = validatorMethod({ user_id, opposite_user_id }, res);
    if (validation) {
      const room_id = await generateChatRoomId(user_id, opposite_user_id);
      const find = await Chat.find({ room_id }).sort({ createdAt: -1 }).lean();
      const modifiedArray = await find.map((item, index) => {
        return {
          ...item,
          messages: item?.messages ? JSON.parse(item?.messages) : [],
        };
      });
      res.status(200).json({
        status: true,
        message: "Messages fetch successfully.",
        data: modifiedArray?.[0]?.messages || [],
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

const fetchInboxList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (!validation) {
      return res.status(400).json({
        status: false,
        message: "Validation failed.",
      });
    }

    // Fetch chats where user_id matches either user_id_1 or user_id_2
    const find = await Chat.find({
      $or: [{ user_id_1: user_id }, { user_id_2: user_id }],
    }).sort({ createdAt: -1 }).lean();

    // Process each chat document
    const modifiedArray = await Promise.all(
      find.map(async (item) => {
        // Determine the opposite user ID
        const opposite_user_id =
          item.user_id_1 === user_id ? item.user_id_2 : item.user_id_1;

        // Fetch the details of the opposite user
        const opposite_user_detail = await Users.findOne({
          user_id: opposite_user_id,
        }).lean();

        // Exclude messages and include opposite user's name
        const { messages, ...rest } = item;
        return {
          ...rest,
          name: opposite_user_detail?.name,
        };
      })
    );

    res.status(200).json({
      status: true,
      message: "Messages fetched successfully.",
      data: modifiedArray,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchPlaceOrders = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Order.find({ user_id }).sort({ createdAt: -1 }).lean();
      const modifiedArray = await Promise.all(
        find.map(async (item) => {
          const subjectFileIds = JSON.parse(item.subject_file_ids);
          const subjectFiles = await SubjectFiles.find({
            subject_file_id: { $in: subjectFileIds },
          });

          // Ab async map ke liye Promise.all use karein
          const subjectFilesWithSubjectData = await Promise.all(
            subjectFiles.map(async (subjectFile) => {
              const findSubject = await Subject.findOne({
                subject_id: subjectFile.subject_id,
              });

              return {
                ...subjectFile._doc,
                subject_name: `${findSubject?.subject_description + findSubject.subject_code
                  } - Section ${findSubject.section}`,
              }; // subjectFile ka data return karein with subject details
            })
          );

          return {
            ...item,
            subject_files: subjectFilesWithSubjectData,
          }; // Return updated item with subject data
        })
      );
      res.status(200).json({
        status: true,
        message: "Order fetch successfully.",
        data: modifiedArray,
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

const createRider = async (req, res) => {
  try {
    const { rider_status_for_student, user_id } = req.body;
    const validation = validatorMethod({ rider_status_for_student }, res);

    if (validation) {
      const find = await Users.findOne({ user_id });
      find.rider_status_for_student =
        rider_status_for_student || find.rider_status_for_student;
      await find.save();
      if (find) {
        const messageHandler = () => {
          if (rider_status_for_student == riderAccountStatus.apply) {
            return "Your request has been sent to the admin.";
          } else if (rider_status_for_student == riderAccountStatus.approve) {
            return "Rider account has been approve";
          } else if (rider_status_for_student == riderAccountStatus.activate) {
            return "Rider account has been activate";
          } else if (
            rider_status_for_student == riderAccountStatus.de_activate
          ) {
            return "Rider account has been de-activate";
          } else if (rider_status_for_student == riderAccountStatus.blocked) {
            return "Rider account blocked";
          }
        };
        return res.status(200).json({
          status: true,
          message: messageHandler(),
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

const fetchRiderList = async (req, res) => {
  try {
    const find = await Users.find({
      role_id: "3",
      rider_status_for_student: { $ne: riderAccountStatus.in_active },
    }).sort({ name: 1 }).lean();
    if (find) {
      const filter = find.filter(
        (item, index) => item.rider_status_for_student != "inActive"
      );

      const modifiedArray = filter.map((item, index) => {
        return {
          ...item,
          claim_code: generateClaimCode(item.user_id),
        };
      });
      return res.status(200).json({
        status: true,
        message: "Rider fetch successfully.",
        data: modifiedArray,
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

const fetchRiderStatus = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (validation) {
      const find = await Users.findOne({ user_id });
      if (find) {
        return res.status(200).json({
          status: true,
          data: {
            rider_status: find?.rider_status_for_student,
          },
          message: "",
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

const fetchActivationTime = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (validation) {
      const find = await RiderActivation.findOne({ user_id }).lean();
      if (find) {
        return res.status(200).json({
          status: true,
          data: JSON.parse(find.activation_time),
          message: "Fetch activation successfully.",
        });
      } else {
        console.log(JSON.stringify(activation_array));
        const created = await RiderActivation.create({
          user_id,
          activation_time: JSON.stringify(activation_array),
        });
        if (created) {
          return res.status(200).json({
            status: true,
            data: activation_array,
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
const editActivationTime = async (req, res) => {
  try {
    const { user_id, activation_time } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (validation) {
      const find = await RiderActivation.findOne({ user_id });
      if (find) {
        find.activation_time = activation_time || find.activation_time;
        await find.save(); // Save the updated document

        return res.status(200).json({
          status: true,
          data: find,
        });
      } else {
        return res.status(200).json({
          status: false,
          message: "Rider not found!",
        });
      }
    }
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchRiderDashboard = async (req, res) => {
  try {
    const { user_id, is_complete } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      if (is_complete) {
        const find = await Order.find({
          rider_id: user_id,
          order_status: orderStatus.completed,
        })
          .sort({ created_at: -1 })
          .lean();
        const modifiedArray = find?.map((item, index) => {
          return {
            ...item,
            claim_code: generateClaimCode(item.user_id),
            generate_order_id: generateClaimCode(item.order_id, "ORD#"),
            original_order_id: item.order_id
          };
        });
        res.status(200).json({
          status: true,
          message: "Order fetch successfully.",
          data: modifiedArray,
        });
      } else {
        const find = await Order.find({
          rider_id: user_id,
          order_status: { $ne: orderStatus.completed },
        })
          .sort({ created_at: -1 })
          .lean();
        const modifiedArray = find?.map((item, index) => {
          return {
            ...item,
            claim_code: generateClaimCode(item.user_id),
            generate_order_id: generateClaimCode(item.order_id, "ORD#"),
          };
        });
        res.status(200).json({
          status: true,
          message: "Order fetch successfully.",
          data: modifiedArray,
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

const fetchOrderDetail = async (req, res) => {
  try {
    const { order_id } = req.body;
    const validation = validatorMethod({ order_id }, res);

    if (validation) {
      const find = await Order.aggregate([
        {
          $match: { order_id: Number(order_id) }, // Find the order by order_id
        },
        {
          $lookup: {
            from: "app_users", // The collection you're joining (app_users)
            let: { user_id: "$user_id" }, // Reference to the user_id in the Order collection
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$user_id" }, "$$user_id"] }, // Convert app_users.user_id to string for comparison
                },
              },
            ],
            as: "user_detail", // The name for the result of the joined data
          },
        },
        {
          $unwind: {
            path: "$user_detail",
            preserveNullAndEmptyArrays: true, // This will allow it to continue if the field is not an array or is null
          },
        },
        {
          $lookup: {
            from: "addresses", // The collection you're joining (addresses)
            let: { user_id: "$user_id", address_id: "$address_id" }, // Reference to the user_id and address_id in the Order collection
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toString: "$user_id" }, "$$user_id"] }, // Convert addresses.user_id to string for comparison with order's user_id
                      { $eq: [{ $toString: "$address_id" }, "$$address_id"] }, // Ensure address_id from Order matches address_id in addresses
                    ],
                  },
                },
              },
            ],
            as: "address", // The name for the result of the joined data
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true, // This will allow it to continue if the field is not an array or is null
          },
        },
      ]);

      // Check if an order was found
      if (find.length === 0) {
        return res.status(200).json({
          status: false,
          message: "Order not found.",
        });
      }

      // Fetch associated subject files
      const findFiles = await SubjectFiles.find({
        subject_file_id: { $in: JSON.parse(find[0]?.subject_file_ids || "[]") }, // Fallback to an empty array if not found
      });

      // Return both order details and associated files
      res.status(200).json({
        status: true,
        message: "Order fetch successfully.",
        data: {
          order: find[0], // The order details
          subjectFiles: findFiles, // The associated subject files
        },
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

const fetchOrders = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);

    if (validation) {
      const find = await Order.aggregate([
        {
          $match: { user_id: user_id }, // Find the order by order_id
        },
        {
          $lookup: {
            from: "app_users", // The collection you're joining (app_users)
            let: { user_id: "$user_id" }, // Reference to the user_id in the Order collection
            pipeline: [
              {
                $match: {
                  $expr: { $eq: [{ $toString: "$user_id" }, "$$user_id"] }, // Convert app_users.user_id to string for comparison
                },
              },
            ],
            as: "user_detail", // The name for the result of the joined data
          },
        },
        {
          $unwind: {
            path: "$user_detail",
            preserveNullAndEmptyArrays: true, // This will allow it to continue if the field is not an array or is null
          },
        },
        {
          $lookup: {
            from: "addresses", // The collection you're joining (addresses)
            let: { user_id: "$user_id", address_id: "$address_id" }, // Reference to the user_id and address_id in the Order collection
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: [{ $toString: "$user_id" }, "$$user_id"] }, // Convert addresses.user_id to string for comparison with order's user_id
                      { $eq: [{ $toString: "$address_id" }, "$$address_id"] }, // Ensure address_id from Order matches address_id in addresses
                    ],
                  },
                },
              },
            ],
            as: "address", // The name for the result of the joined data
          },
        },
        {
          $unwind: {
            path: "$address",
            preserveNullAndEmptyArrays: true, // This will allow it to continue if the field is not an array or is null
          },
        },
      ]);

      // Fetch associated subject files

      const findMap = await Promise.all(
        find.map(async (item) => {
          const findFiles = await SubjectFiles.find({
            subject_file_id: { $in: JSON.parse(item.subject_file_ids || "[]") }, // Fallback to an empty array if not found
          });
          return {
            ...item,
            subjectFiles: findFiles
          };
        })
      );

      // Return both order details and associated files
      res.status(200).json({
        status: true,
        message: "Order fetch successfully.",
        data: findMap,
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

const editOrderStatus = async (req, res) => {
  try {
    const { order_id, order_status } = req.body;
    const validation = validatorMethod({ order_id, order_status }, res);

    if (validation) {
      const find = await Order.findOne({ order_id });
      find.order_status = order_status || find.order_status;
      if (find?.rider_id && find.order_status == orderStatus.completed) {
        await walletHandler({
          user_id: find?.rider_id,
          transactionType: "credit",
          amount,
          transaction_reason: `You have completed the order; ${find.rider_charges} PHP is being sent to your wallet.`,
        });
      }
      await find.save();
      // Check if an order was found
      if (find) {
        sendNotification(
          find?.user_id,
          "Order Status",
          `Your order status is ${find.order_status}.`
        );
        return res.status(200).json({
          status: true,
          message: "Order status update successfully.",
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

const fetchRiderRadius = async (req, res) => {
  try {
    const { rider_id } = req.body;
    const validation = validatorMethod({ rider_id }, res);
    if (validation) {
      const find = await Users.findOne({ user_id: rider_id });
      res.status(200).json({
        status: true,
        message: "Rider radius fetch successfully.",
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

const createOrderProof = async (req, res) => {
  try {
    const { user_id, order_id } = req.body;
    const files = Array.isArray(req.files)
      ? req.files?.map((item, index) => item.location)
      : [];
    console.log("files", files);

    const validation = validatorMethod({ user_id, order_id }, res);
    if (validation) {
      const created = await OrderProof.create({
        user_id: user_id,
        order_id,
        file_uploads: files,
      });
      res.status(200).json({
        status: true,
        message: "Create order proof successfully.",
        data: created,
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

const fetchOrderProof = async (req, res) => {
  try {
    const { order_id } = req.body;
    const validation = validatorMethod({ order_id }, res);
    if (validation) {
      const find = await OrderProof.findOne({ order_id });
      res.status(200).json({
        status: true,
        message: "Order proof fetch successfully.",
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

module.exports = {
  // teacher
  login,
  register,
  fetchEmailVerifyForRegisteration,
  fetchInstituteList,
  fetchDepartmentList,
  fetchSemesterList,
  createTeacherPage,
  teacherDashboard,
  createSubjectFile,
  teacherSubjectList,
  // teacher profile
  fetchSubscriberList,
  fetchSubscriberedList,
  createSubscribePackage,
  // student
  createSubscribeSubjectForStudent,
  fetchSubscribeSubjectForStudent,
  fetchTeacherSubjectFiles,
  deleteTeacherSubjectFiles,
  // common
  notificationList,
  fetchCartSubjectFileList,
  createAddress,
  fetchAddressList,
  editDefaultAddress,
  fetchPaperSizeList,
  fetchRiderDropDown,
  editWalletTopup,
  fetchTransactions,
  createPlaceOrder,
  fetchOrderList,
  SendMessages,
  fetchMessagesList,
  fetchInboxList,
  fetchUsers,
  fetchPlaceOrders,
  //rider
  EditRiderCoordinates,
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
  fetchOrderProof,
  fetchRiderList,
  fetchOrders,
  EditPlaceBranchOrder,
  EditPlaceRiderOrder
};
