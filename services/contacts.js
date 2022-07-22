const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../models");

const getAll = async () => {
  try {
    const result = await listContacts();
    return result;
  } catch (error) {
    return error;
  }
};

const getContact = async (id) => {
  try {
    const result = await getContactById(id);
    return result;
  } catch (error) {
    return error;
  }
};

const postContact = async (body) => {
  try {
    const result = await addContact(body);
    return result;
  } catch (error) {
    return error;
  }
};

const deleteContact = async (id) => {
  try {
    const result = await removeContact(id);
    return result;
  } catch (error) {
    return error;
  }
};

const putContact = async (id, body) => {
  try {
    const result = await updateContact(id, body);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAll,
  getContact,
  postContact,
  deleteContact,
  putContact,
};
