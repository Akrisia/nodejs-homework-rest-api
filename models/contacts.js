const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
}

async function updateContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
}

async function getContactById(id) {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === id);
  if (!result) {
    return null;
  }
  return result;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === id);
  if (idx === -1) {
    return null;
  }
  const removedContact = contacts.splice(idx, 1);
  await updateContacts(contacts);
  return removedContact;
}

async function addContact({ name, email, phone }) {
  const contacts = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

async function updateContact(id, body) {
  const contacts = await listContacts();
  const idx = contacts.findIndex((contact) => contact.id === id);
  if (idx === -1) {
    return null;
  }
  contacts[idx] = { ...body, id };
  await updateContacts(contacts);
  return contacts[idx];
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
