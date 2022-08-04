const express = require("express");
const router = express.Router();
const { validation, auth } = require("../helpers");
const { joiSchema } = require("../service/schemas/user");
const { ctrlUser } = require("../controller");

router.post("/signup", validation(joiSchema), ctrlUser.signup);

router.post("/login", validation(joiSchema), ctrlUser.login);

router.get("/current", auth, ctrlUser.getCurrent);

router.get("/logout", auth, ctrlUser.logout);

module.exports = router;
