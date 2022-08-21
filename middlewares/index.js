const {
  validation,
  emailValidation,
  favoriteValidation,
  subscriptionValidation,
} = require("./validation");
const auth = require("./auth");
const upload = require("./upload");

module.exports = {
  validation,
  emailValidation,
  favoriteValidation,
  subscriptionValidation,
  auth,
  upload,
};
