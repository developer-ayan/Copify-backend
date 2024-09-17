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
} = require("../../../utils/helpers");
const { secret_key, SEMESTERS } = require("../../../utils/static-values");
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
    const { email, password, name, contact_number, role_id, institute_id } =
      req.body;
    const validation = validatorMethod(
      { email, name, role_id, contact_number, institute_id, password },
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

const EditRiderCoordinates = async (req, res) => {
  try {
    const { user_id, latitude, longitude } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const updated = await Users.findOne({ user_id });
      updated.location.coordinates =
        [parseFloat(longitude), parseFloat(latitude)] ||
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
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Department.aggregate([
        {
          $match: {
            institute_id: Number(institute_id), // Match the department based on institute_id
          },
        },
        {
          $addFields: {
            department_id_str: { $toString: "$department_id" },
          },
        },
        {
          $lookup: {
            from: "subjects", // The collection to join with
            localField: "department_id_str", // Field from Department, converted to string
            foreignField: "department_id", // Field from Subjects, assumed to be string
            as: "semester", // The name of the new array field to add to the result
          },
        },
      ]);

      if (find) {
        const modifiedArray = await find.map((item, index) => {
          return {
            ...item,
            semester: item.semester.map((e) => {
              return {
                ...e,
                semester_name: getValueById(SEMESTERS, Number(e.semester_id)),
              };
            }),
          };
        });
        res.status(200).json({
          status: true,
          message: "Department fetched successfully.",
          data: modifiedArray,
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

const fetchDepartmentList = async (req, res) => {
  try {
    const { institute_id } = req.body;
    const validation = validatorMethod({ institute_id }, res);
    if (validation) {
      const find = await Department.find({ institute_id });
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

const createSubjectFile = async (req, res) => {
  console.log('req', req?.file?.key)
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
      req.file && delete_file("uploads/", req.file.location);
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

const fetchTeacherSubjectFiles = async (req, res) => {
  try {
    const { user_id, publish_or_save } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await SubjectFiles.find({ user_id, publish_or_save });
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
      const find = await Notification.find({ user_id });
      if (find) {
        res.status(200).json({
          status: true,
          message: "Notification fetch successfully.",
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

const fetchCartSubjectFileList = async (req, res) => {
  try {
    const { subject_file_ids } = req.body;
    const validation = validatorMethod({ subject_file_ids }, res);
    if (validation) {
      const find = await SubjectFiles.find({
        subject_file_id: { $in: JSON.parse(subject_file_ids) },
      });
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
    const validation = validatorMethod({ address, title, contact_number, user_id }, res);
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
      const find = await Address.find({ user_id });
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
    )
    res.status(200).json({
      status: true,
      message: "Paper size fetch successfully.",
      data: modfiedArr,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};

const fetchRiderDropDown = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const validation = validatorMethod({ latitude, longitude }, res);
    if (validation) {
      // Convert kilometers to radians (5 km / Earth's radius in kilometers)
      const riderRadius = await RiderRadius.findOne({})
      const radiusInKm = parseFloat(riderRadius?.rider_radius) || 5;
      const earthRadiusInKm = 6378.1;

      const find = await Users.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            distanceField: "distance",
            maxDistance: radiusInKm * 1000, // Convert kilometers to meters
            spherical: true,
            query: {
              role_id: '3',
              rider_status_for_student: 'active'
            }
          }
        }
      ]);

      const modifiedArray = find?.map((item, index) => {
        return { user_id: item.user_id, name: item.name, distance: toFixedMethod(item.distance) }
      })

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
    const { user_id, amount, card_number, year, month, cvv } = req.body;
    const validation = validatorMethod({ user_id, amount, card_number, year, month, cvv }, res);
    if (validation) {
      const response = await walletHandler({ user_id, transactionType: 'credit', amount })
      if (response) {
        res.status(200).json(response)
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

const createPlaceOrder = async (req, res) => {
  try {
    const {
      user_id,
      rider_id,
      subject_file_ids,
      self_pickup,
      address_id,
      shop_id,
      rider_charges,
      sub_total,
      total_price,
      transaction_type
    } = req.body;
    const validation = validatorMethod({
      user_id,
      rider_id,
      subject_file_ids,
      address_id,
      sub_total,
      total_price,
      transaction_type
    }, res);

    if (transaction_type == 'wallet') {
      const find = await Wallet.findOne({ user_id });
      if (find) {
        const currentWalletAmount = parseFloat(find?.amount);
        const totalPrice = parseFloat(total_price);

        // Check if the current wallet amount is less than the total price
        if (currentWalletAmount < totalPrice) {
          return res.status(200).json({
            status: false,
            message: `You need to top up ${toFixedMethod(totalPrice - currentWalletAmount)} PHP.`,
          });
        } else {
          const response = await walletHandler({ user_id, transactionType: 'debit', amount: total_price, transaction_reason: "You have placed the order. This is the amount that has been debited." })
          if (response?.status == true) {
            const created = await Order.create({
              user_id,
              rider_id,
              subject_file_ids,
              self_pickup,
              address_id,
              order_status: "pending",
              shop_id,
              rider_charges,
              sub_total,
              total_price,
              transaction_id: response?.data?.transaction_id
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
          message: `You need to top up ${toFixedMethod(total_price)} PHP.`
        });
      }
    }

    if (validation) {

      const created = await Order.create({
        user_id,
        rider_id,
        subject_file_ids,
        self_pickup,
        address_id,
        order_status: "pending",
        shop_id,
        rider_charges,
        sub_total,
        total_price
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

const fetchOrderList = async (req, res) => {
  try {
    const { user_id } = req.body;
    const validation = validatorMethod({ user_id }, res);
    if (validation) {
      const find = await Order.find({ user_id }).sort({ created_at: -1 }).lean();
      res.status(200).json({
        status: true,
        message: "Order fetch successfully.",
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
          $unwind: "$transactions" // Deconstruct the transactions array
        },
        {
          $sort: { "transactions.created_at": -1 } // Sort transactions in descending order based on created_at
        },
        {
          $group: {
            _id: "$_id", // Group by Wallet's _id
            user_id: { $first: "$user_id" }, // Include user_id
            amount: { $first: "$amount" }, // Include wallet amount
            transactions: { $push: "$transactions" } // Reconstruct transactions array with sorted transactions
          }
        }
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
    const validation = validatorMethod({ user_id, opposite_user_id, message }, res);
    const createdAt = new Date().toISOString();
    if (!validation) return;
    const room_id = await generateChatRoomId(user_id, opposite_user_id);
    const find = await Chat.findOne({ room_id });
    if (find) {
      const parseMessage = JSON.parse(find.messages);
      parseMessage.push({ message, user_id, created_at: createdAt });
      find.last_message = message || find.last_message;
      find.messages = JSON.stringify(parseMessage);
      await find.save();
    } else {
      await Chat.create({
        last_message: message,
        messages: JSON.stringify([{ message, user_id, created_at: createdAt }]),
        room_id,
        user_id_1: user_id,
        user_id_2: opposite_user_id,
      });
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
      const find = await Chat.find({ room_id }).lean();
      const modifiedArray = await find.map((item, index) => {
        return {
          ...item,
          messages: item?.messages ? JSON.parse(item?.messages) : [],
        }
      })
      res.status(200).json({
        status: true,
        message: "Messages fetch successfully.",
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
      $or: [
        { user_id_1: user_id },
        { user_id_2: user_id },
      ]
    }).lean();

    // Process each chat document
    const modifiedArray = await Promise.all(find.map(async (item) => {
      // Determine the opposite user ID
      const opposite_user_id = item.user_id_1 === user_id ? item.user_id_2 : item.user_id_1;

      // Fetch the details of the opposite user
      const opposite_user_detail = await Users.findOne({ user_id: opposite_user_id }).lean();

      // Exclude messages and include opposite user's name
      const { messages, ...rest } = item;
      return {
        ...rest,
        name: opposite_user_detail?.name
      };
    }));

    res.status(200).json({
      status: true,
      message: "Messages fetched successfully.",
      data: modifiedArray,
    });
  } catch (error) {
    catchErrorValidation(error, res);
  }
};





module.exports = {
  // teacher
  login,
  register,
  fetchInstituteList,
  fetchDepartmentList,
  fetchSemesterList,
  createTeacherPage,
  teacherDashboard,
  createSubjectFile,
  teacherSubjectList,
  // teacher profile
  fetchSubscriberList,
  // student
  createSubscribeSubjectForStudent,
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
  //rider
  EditRiderCoordinates,
};
