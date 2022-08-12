const { User } = require("./schemas/user");

const findUser = async ({ email }) => {
  return User.findOne({ email });
};

const findUserById = async (id) => {
  return User.findById(id);
};

const signupUser = async ({ email, password, avatarURL }) => {
  return User.create({ email, password, avatarURL });
};

const loginUser = async (id, token) => {
  return User.findByIdAndUpdate(id, { token });
};

const logoutUser = async (id) => {
  return User.findByIdAndUpdate(id, { token: null });
};

const updateSubscription = async (id, subscription) => {
  return User.findByIdAndUpdate(id, { subscription });
};

const updateAvatar = async (id, avatarURL) => {
  return User.findByIdAndUpdate(id, { avatarURL });
};

module.exports = {
  findUser,
  findUserById,
  signupUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
