const { Contact } = require("./schemas/contact");

const listContacts = async (_id, skip, limit, favorite) => {
  if (favorite === "true") {
    return Contact.find({ owner: _id, favorite: true }, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id email");
  }
  if (favorite === "false") {
    return Contact.find({ owner: _id, favorite: false }, "", {
      skip,
      limit: Number(limit),
    }).populate("owner", "_id email");
  }
  return Contact.find({ owner: _id }, "", {
    skip,
    limit: Number(limit),
  }).populate("owner", "_id email");
};

const getContactById = (id) => {
  return Contact.findOne({ _id: id });
};

const addContact = ({ name, email, phone, favorite, owner }) => {
  return Contact.create({ name, email, phone, favorite, owner });
};

const updateContact = (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body);
};

const removeContact = (id) => {
  return Contact.findByIdAndRemove({ _id: id });
};

const updateStatusContact = (id, body) => {
  return Contact.findByIdAndUpdate({ _id: id }, body);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
