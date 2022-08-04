const { User } = require("./schemas/user");

const findUser = async ({ email }) => {
  return User.findOne({ email });
};

const findUserById = async (id) => {
  return User.findById(id);
};

const signupUser = async ({ email, password }) => {
  return User.create({ email, password });
};

const loginUser = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
};

const logoutUser = async (id) => {
  return User.findByIdAndUpdate(id, { token: null });
};

module.exports = {
  findUser,
  findUserById,
  signupUser,
  loginUser,
  logoutUser,
};
