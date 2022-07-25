const service = require("../service");
const createError = require("../helpers");
const { favoriteJoiSchema } = require("../service/schemas/contact");

const listContacts = async (_, res, next) => {
  try {
    const contacts = await service.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await service.getContactById(id);
    if (!contact) {
      throw createError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { name, email, phone, favorite = false } = req.body;
  try {
    const contact = await service.addContact(
      { name, email, phone, favorite },
      { new: true }
    );
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await service.removeContact(id);
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
  const { id } = req.params;
  const { name, email, phone, favorite = false } = req.body;
  try {
    const contact = await service.updateContact(
      id,
      {
        name,
        email,
        phone,
        favorite,
      },
      { new: true }
    );
    if (!contact) {
      throw createError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = favoriteJoiSchema.validate(req.body);
    if (error) {
      throw createError(400, "Missing field favorite");
    }
    const { id } = req.params;
    const { favorite } = req.body;
    const contact = await service.updateStatusContact(
      id,
      { favorite },
      { new: true }
    );
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
  updateStatusContact,
};
