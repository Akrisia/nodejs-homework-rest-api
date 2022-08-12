const { serviceContacts } = require("../services");
const { NotFound } = require("http-errors");

const listContacts = async (req, res, next) => {
  const { _id } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;
  try {
    const contacts = await serviceContacts.listContacts(
      _id,
      skip,
      limit,
      favorite
    );
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const contact = await serviceContacts.getContactById(id);
    if (!contact) {
      throw new NotFound("Not Found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email, phone } = req.body;
  try {
    const contact = await serviceContacts.addContact(
      { name, email, phone, favorite: false, owner: _id },
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
    const contact = await serviceContacts.removeContact(id);
    if (!contact) {
      throw new NotFound("Not Found");
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
    const contact = await serviceContacts.updateContact(
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
      throw new NotFound("Not Found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { favorite } = req.body;
    const contact = await serviceContacts.updateStatusContact(
      id,
      { favorite },
      { new: true }
    );
    if (!contact) {
      throw new NotFound("Not Found");
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
