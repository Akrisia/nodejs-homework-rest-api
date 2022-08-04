const express = require("express");
const router = express.Router();
const { validation, subscriptionValidation, auth } = require("../helpers");
const { joiSchema, joiSubscriptionSchema } = require("../service/schemas/user");
const { ctrlUser } = require("../controller");

router.post("/signup", validation(joiSchema), ctrlUser.signup);

router.post("/login", validation(joiSchema), ctrlUser.login);

router.get("/current", auth, ctrlUser.getCurrent);

router.get("/logout", auth, ctrlUser.logout);

router.patch(
  "/",
  auth,
  subscriptionValidation(joiSubscriptionSchema),
  ctrlUser.updateSubscription
);

module.exports = router;
