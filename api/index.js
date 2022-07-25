const express = require("express");
const router = express.Router();
const ctrlContact = require("../controller");

router.get("/", ctrlContact.listContacts);

router.get("/:id", ctrlContact.getContactById);

router.post("/", ctrlContact.addContact);

router.delete("/:id", ctrlContact.removeContact);

router.put("/:id", ctrlContact.updateContact);

router.patch("/:id/favorite", ctrlContact.updateStatusContact);

module.exports = router;
