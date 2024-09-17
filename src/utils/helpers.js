var fs = require("fs");
const OneSignal = require("onesignal-node");
const path = require("path");
const Notification = require("../api/models/common/notification");
const Users = require("../api/models/app/user");
const nodemailer = require("nodemailer");
const Transaction = require("../api/models/common/transaction");
const Wallet = require("../api/models/common/wallet");
const uploads = path.join(__dirname, "../uploads/");

const delete_file = async (path, fileName) => {
  console.log(uploads + fileName);
  fs.unlink(uploads + fileName, function (err) { });
};

const check_extension = async (fileName) => {
  console.log(uploads + fileName);
  fs.unlink(uploads + fileName, function (err) { });
};

const modifiedArray = async (id, value, arr, childData) => {
  const modfiedArr = arr.map((item, index) => {
    if (childData) {
      return { ...item, id: item[id], value: item[value] };
    } else {
      return { id: item[id], value: item[value] };
    }
  });
  return modfiedArr;
};

async function sendNotification(user_id, heading, message) {
  const restApi = "OTMzNDhjYTItOGI2NC00ZDFlLTgxODMtODI2OTMxZGIzODUy";
  const appId = "2fe1426b-1143-4ac2-bfa7-3fa03a5d432c";
  try {
    const find = await Users.findOne({ user_id });

    // const client = new OneSignal.Client(appId, restApi);

    // const notification = {
    //   headings: { en: heading || "Notification Title" },
    //   contents: { en: message || "Hello, this is a push notification!" },
    //   include_player_ids: [find?.notification_token],
    //   // included_segments: ['All'],
    // };

    // const response = await client.createNotification(notification);
    const transaction = await Notification.create({
      user_id: find?.user_id,
      heading,
      message,
    });
    return true;
  } catch (error) {
    return error.message;
  }
}

async function saveTransaction(user_id, amount, transaction_reason, transaction_ref_id) {
  try {
    const transaction = await Transaction.create({
      user_id: user_id,
      amount,
      transaction_reason,
      transaction_ref_id
    });
    return true;
  } catch (error) {
    return error.message;
  }
}

// async function sendEmail() {
//     const testAccount = await nodemailer.createTestAccount()
//     const transporter = await nodemailer.createTransport({
//         host: "smpt.ethereal.email",
//         port: 587,
//         secure: true,
//         auth: {
//             user: testAccount.user,
//             pass: testAccount.pass
//         },
//     });
//   transporter.sendMail({
//       from: "OpenJavascript <test@openjavascript.info>",
//       to: "ayan.ali25508@gmail.com",
//       subject: "Testing, testing",
//       text: "test",
//     },
//     function (error, info) {
//       if (error) {
//         console.log(error)
//         return 0;
//       } else {
//         console.log(info.response)
//         return info.response;
//       }
//     }
//   );
// }

async function sendEmail() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻"<ayan.ali25508@gmail.com>', // sender address
    to: "ayan.ahmed2634@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
    attachments: [
      {
        filename: "hello.json",
        content: JSON.stringify({
          name: "Hello World!",
        }),
      },
    ],
  });

  console.log("Message sent: %s", info.messageId);

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const walletHandler = async ({ user_id, amount, transactionType, transaction_reason }) => {
  try {
    const find = await Wallet.findOne({ user_id });

    let updatedAmount;

    if (find) {
      let existingAmount = parseFloat(find?.amount);

      if (transactionType === "credit") {
        updatedAmount = existingAmount + parseFloat(amount);
      } else if (transactionType === "debit") {
        updatedAmount = existingAmount - parseFloat(amount);
      } else {
        return {
          status: false,
          message: "Invalid transaction type!",
        };
      }

      const updated = await Wallet.findOneAndUpdate(
        { user_id: user_id },
        { $set: { amount: updatedAmount } },
        { new: true }
      );

      if (updated) {
        const created = await Transaction.create({
          user_id,
          amount: toFixedMethod(amount),
          transaction_reason: transaction_reason || 'Xendit topup',
          transaction_type: transactionType,
          transaction_ref_id: generateTransactionId()
        });

        return {
          status: true,
          message: `${toFixedMethod(amount)} PHP has been ${transactionType}ed from your account.`,
          data: created
        };
      } else {
        return {
          status: false,
          message: "Something went wrong!",
        };
      }
    } else {
      if (transactionType === "debit") {
        return {
          status: false,
          message: "Account does not exist for debit transaction!",
        };
      }

      const created = await Wallet.create({
        user_id,
        amount: transactionType === "credit" ? amount : 0
      });

      if (created) {
        const created = await Transaction.create({
          user_id,
          amount: toFixedMethod(amount),
          transaction_reason: transaction_reason || 'Xendit topup',
          transaction_type: transactionType,
          transaction_ref_id: generateTransactionId()
        });

        return {
          status: true,
          message: `${toFixedMethod(amount)} PHP has been ${transactionType}ed to your account.`,
          data: created
        };
      } else {
        return {
          status: false,
          message: "Something went wrong!",
        };
      }
    }
  } catch (error) {
    return {
      status: false,
      message: "An error occurred!",
    };
  }
};


function validatorMethod(args, res) {
  // args contains the data to validate
  const data = args || {}; // Extract data to validate
  let error = "";

  // Iterate over each field in the data and check if it's empty
  for (const [field, value] of Object.entries(data)) {
    if (value == "undefined" || value == null || (value == "" && !value)) {
      error = `${field} is required`;
      break;
    }
  }

  if (error) {
    // Respond with status code 200 and error messages if there are validation errors
    res.status(200).json({
      success: false,
      message: error,
    });
    return 0;
  } else {
    return 1;
  }
}

const catchErrorValidation = async (error, res) => {
  if (error.name === "ValidationError") {
    // Handle Mongoose validation errors
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(200).json({
      status: false,
      message: errors?.[0] || "Something went wrong!",
    });
  } else {
    return res.status(200).json({
      status: false,
      message: error?.message,
    });
  }
};

const generateClaimCode = (number) => {
  const prefix = "CDK";
  const paddedNumber = String(number).padStart(7, "0");
  return prefix + paddedNumber;
};
const getValueById = (arr, id) => {
  const getValue = arr.filter((item, index) => item.id == id)?.[0]?.value || "";
  return getValue;
};

const toFixedMethod = (number) => {
  const num = isNaN(number) ? "0.00" : parseFloat(number).toFixed(2)
  return num.toString()
}

function generateTransactionId() {
  return 'txn_' + Math.random().toString(36).substr(2, 9) + Date.now();
}

function generateChatRoomId(user_id_1, user_id_2) {
  // Sort the user IDs to ensure consistency
  const sortedIds = [user_id_1, user_id_2].sort();
  // Concatenate the sorted IDs to form the chat room ID
  const merge_id = sortedIds.join('_');
  return merge_id;
}

module.exports = {
  delete_file,
  sendNotification,
  sendEmail,
  validatorMethod,
  catchErrorValidation,
  check_extension,
  modifiedArray,
  generateClaimCode,
  getValueById,
  toFixedMethod,
  saveTransaction,
  generateTransactionId,
  walletHandler,
  generateChatRoomId
};
