const express = require("express");
const router = express.Router();
const {
  validation,
  subscriptionValidation,
  auth,
  upload,
} = require("../middlewares");
const {
  joiSchema,
  joiSubscriptionSchema,
} = require("../services/schemas/user");
const { ctrlUser } = require("../controllers");

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

router.patch("/avatars", auth, upload.single("avatar"), ctrlUser.updateAvatar);

module.exports = router;
