const {
  getAll,
  getContact,
  postContact,
  deleteContact,
  putContact,
} = require("../services");
const { createError } = require("../helpers");
const { contactsSchema } = require("../schemas");

const listContacts = async (_, res, next) => {
  try {
    const contacts = await getAll();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getContact(id);
    if (!contact) {
      throw createError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(400, "Missing required name field");
    }
    const contact = await postContact(req.body);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await deleteContact(id);
    if (!contact) {
      throw createError(404);
    }
    res.json({
      message: "Contact deleted",
    });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      throw createError(400, "Missing fields");
    }
    const { id } = req.params;
    const contact = await putContact(id, req.body);
    if (!contact) {
      throw createError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
