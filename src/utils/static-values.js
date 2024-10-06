const moment = require("moment");

const database_name = "COPIFY_DIGITAL";
const created_at =
  moment(new Date()).format("dd mm yyyy") +
  " " +
  moment(new Date()).format("hh:mm A");
const secret_key =
  "4059c3b216690d995a98a847676e69c63c315f2bed6b237c2bfbd6bdb2d66c3c1c75bae1f357e3958c78c7964cf04ac5512557b2f213538017f2d5c4f5b872e8";

const AWS_ACCESS_KEY_ID = 'AKIA6ODU4IRO4U3AUR4O'
const AWS_SECRET_ACCESS_KEY = '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'

const SEMESTERS = [
  {
    id: 1,
    value: 'First'
  },
  {
    id: 2,
    value: 'Second'
  },
  {
    id: 3,
    value: 'Summer'
  },
]

const activation_array = [
  {
    day: "Monday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Tuesday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Wednesday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Thursday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Friday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Saturday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  },
  {
    day: "Sunday",
    activation_time: [
      { id: 1, time: '7:00 AM To 7:30 AM', activate: false },
      { id: 2, time: '7:30 AM To 8:00 AM', activate: false },
      { id: 3, time: '8:00 AM To 8:30 AM', activate: false },
      { id: 4, time: '8:30 AM To 9:00 AM', activate: false },
      { id: 5, time: '9:00 AM To 9:30 AM', activate: false },
      { id: 6, time: '9:30 AM To 10:00 AM', activate: false },
      { id: 7, time: '10:00 AM To 10:30 AM', activate: false },
      { id: 8, time: '10:30 AM To 11:00 AM', activate: false },
      { id: 9, time: '11:00 AM To 11:30 AM', activate: false },
      { id: 10, time: '11:30 AM To 12:00 PM', activate: false },
      { id: 11, time: '12:00 AM To 12:30 PM', activate: false },
      { id: 12, time: '12:30 AM To 1:00 PM', activate: false },
      { id: 13, time: '1:00 AM To 1:30 PM', activate: false },
      { id: 14, time: '1:30 AM To 2:00 PM', activate: false },
      { id: 15, time: '2:00 AM To 2:30 PM', activate: false },
      { id: 16, time: '2:30 AM To 3:00 PM', activate: false },
      { id: 17, time: '3:00 AM To 3:30 PM', activate: false },
      { id: 18, time: '3:30 AM To 4:00 PM', activate: false },
      { id: 19, time: '4:00 AM To 4:30 PM', activate: false },
      { id: 20, time: '4:30 AM To 5:00 PM', activate: false },
      { id: 21, time: '5:00 AM To 5:30 PM', activate: false },
      { id: 22, time: '5:30 AM To 6:00 PM', activate: false },
    ]
  }
]

const orderStatus = {
  pending: "pending",
  in_process: "in process",
  printing: "printing",
  ready_to_delivery: "ready to deliver",
  completed: "completed"
}

const riderAccountStatus = {
  activate: "activate",
  de_activate: "de-activate",
  blocked: "blocked",
  apply: "apply"
}

module.exports = { created_at, database_name, secret_key, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SEMESTERS, riderAccountStatus, activation_array, orderStatus };