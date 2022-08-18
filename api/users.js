const express = require("express");
const router = express.Router();
const {
  validation,
  subscriptionValidation,
  emailValidation,
  auth,
  upload,
} = require("../middlewares");
const {
  joiSchema,
  joiSubscriptionSchema,
  emailSchema,
} = require("../services/schemas/user");
const { ctrlUser } = require("../controllers");

router.post("/signup", validation(joiSchema), ctrlUser.signup);

router.get("/verify/:verificationToken", ctrlUser.verifyEmail);

router.post("/verify", validation(joiSchema), ctrlUser.resendVerificationEmail);

router.post("/login", emailValidation(emailSchema), ctrlUser.login);

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
