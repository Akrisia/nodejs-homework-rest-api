const express = require("express");
const router = express.Router();
const { validation, favoriteValidation, auth } = require("../helpers");
const { joiSchema, favoriteJoiSchema } = require("../service/schemas/contact");
const { ctrlContact } = require("../controller");

router.get("/", auth, ctrlContact.listContacts);

router.get("/:id", ctrlContact.getContactById);

router.post("/", auth, validation(joiSchema), ctrlContact.addContact);

router.delete("/:id", ctrlContact.removeContact);

router.put("/:id", validation(joiSchema), ctrlContact.updateContact);

router.patch(
  "/:id/favorite",
  favoriteValidation(favoriteJoiSchema),
  ctrlContact.updateStatusContact
);

module.exports = router;
