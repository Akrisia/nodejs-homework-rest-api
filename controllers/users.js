const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers");
const { serviceUsers } = require("../services");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await serviceUsers.findUser(email);
    if (user) {
      throw new Conflict("Email in use");
    }
    const avatarURL = gravatar.url(email);
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    const verificationToken = nanoid();
    await serviceUsers.signupUser({
      email,
      password: hashPassword,
      avatarURL,
    });
    const mail = {
      to: email,
      subject: "Registration confirmation",
      html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${verificationToken}'>Click to confirm your registration.</a>`,
    };
    await sendEmail(mail);
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

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await serviceUsers.findVerifiedUser(verificationToken);
    if (!user) {
      throw new NotFound("User is not found");
    }
    await serviceUsers.verifyUser(user._id);
    res.status(200).json("Verification is successful");
  } catch (error) {
    next(error);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await serviceUsers.findUser(email);
    if (!user) {
      throw new NotFound("User is not found");
    }
    if (user.verify) {
      throw new BadRequest("Verification has already been passed");
    }
    const mail = {
      to: email,
      subject: "Registration confirmation",
      html: `<a target='_blank' href='http://localhost:3000/api/users/verify/${user.verificationToken}'>Click to confirm your registration.</a>`,
    };
    await sendEmail(mail);
    res.status(200).json("Verification email is sent");
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await serviceUsers.findUser(email);
    if (!user || !user.comparePassword(password)) {
      throw new Unauthorized("Email or password is wrong");
    }
    if (!user.verify) {
      throw new Unauthorized("Email is not verified");
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
  try {
    const { email } = req.body;
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
  try {
    const { _id } = req.user;
    await serviceUsers.logoutUser(_id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
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
  verifyEmail,
  resendVerificationEmail,
  login,
  getCurrent,
  logout,
  updateSubscription,
  updateAvatar,
};
