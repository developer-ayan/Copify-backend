const moment = require("moment");

const database_name = "COPIFY_DIGITAL";
const created_at =
  moment(new Date()).format("dd mm yyyy") +
  " " +
  moment(new Date()).format("hh:mm A");
const secret_key =
  "4059c3b216690d995a98a847676e69c63c315f2bed6b237c2bfbd6bdb2d66c3c1c75bae1f357e3958c78c7964cf04ac5512557b2f213538017f2d5c4f5b872e8";

module.exports = { created_at, database_name, secret_key };