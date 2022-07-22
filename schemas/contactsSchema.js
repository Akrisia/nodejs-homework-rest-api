const joi = require("joi");

const contactsSchema = joi.object({
  name: joi.string().min(3).max(30).required(),
  email: joi.string().email().required(),
  phone: joi.string().required(),
});

module.exports = contactsSchema;
