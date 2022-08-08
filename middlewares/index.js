const {
  validation,
  favoriteValidation,
  subscriptionValidation,
} = require("./validation");
const auth = require("./auth");
const upload = require("./upload");

module.exports = {
  validation,
  favoriteValidation,
  subscriptionValidation,
  auth,
  upload,
};
