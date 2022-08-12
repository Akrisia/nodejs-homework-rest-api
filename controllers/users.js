const { Conflict, Unauthorized, NotFound } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { serviceUsers } = require("../services");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await serviceUsers.findUser({ email });
    if (user) {
      throw new Conflict("Email in use");
    }
    const avatarURL = gravatar.url(email);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await serviceUsers.signupUser({
      email,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email,
        subscription: "starter",
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await serviceUsers.findUser({ email });
    if (!user || !user.comparePassword(password)) {
      throw new Unauthorized("Email or password is wrong");
    }
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await serviceUsers.loginUser(user._id, token);
    res.status(200).json({
      user: {
        token,
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const { email } = req.body;
  try {
    res.status(200).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  try {
    await serviceUsers.logoutUser(_id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  try {
    const user = await serviceUsers.updateSubscription(_id, subscription);
    if (!user) {
      throw new NotFound("Not found");
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res) => {
  const avatarsDir = path.join(__dirname, "../", "public", "avatars");
  const { _id } = req.user;
  const { path: tmpPath, originalname } = req.file;
  const [extension] = originalname.split(".").reverse();
  const imageName = `${_id}.${extension}`;
  try {
    const resultUpload = path.join(avatarsDir, imageName);
    Jimp.read(tmpPath)
      .then((image) => image.resize(250, 250).write(resultUpload))
      .catch((error) => {
        throw error;
      });
    await fs.rename(tmpPath, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    await serviceUsers.updateAvatar(_id, avatarURL);
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw new Unauthorized("Not authorized");
  }
};

module.exports = {
  signup,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
