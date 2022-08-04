const { serviceUsers } = require("../service");
const { Conflict, Unauthorized } = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createError } = require("../helpers/createError");

require("dotenv").config();
const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await serviceUsers.findUser({ email });
    if (user) {
      throw new Conflict("Email in use");
    }
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    await serviceUsers.signupUser({
      email,
      password: hashPassword,
    });
    res.status(201).json({
      user: {
        email,
        subscription: "starter",
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
  try {
    const { _id } = req.user;
    const { subscription } = req.body;
    const user = await serviceUsers.updateSubscription(_id, subscription);
    if (!user) {
      throw createError(404);
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  getCurrent,
  logout,
  updateSubscription,
};
