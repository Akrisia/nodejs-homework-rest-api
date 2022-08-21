const { User } = require("./schemas/user");

const findUser = async (email) => {
  return User.findOne({ email });
};

const findVerifiedUser = async (verificationToken) => {
  return User.findOne({ verificationToken });
};

const verifyUser = async (id) => {
  return User.findByIdAndUpdate(id, { verificationToken: null, verify: true });
};

const findUserById = async (id) => {
  return User.findById(id);
};

const signupUser = async ({
  email,
  password,
  avatarURL,
  verificationToken,
}) => {
  return User.create({ email, password, avatarURL, verificationToken });
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
  findVerifiedUser,
  verifyUser,
  findUserById,
  signupUser,
  loginUser,
  logoutUser,
  updateSubscription,
  updateAvatar,
};
