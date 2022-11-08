const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user");

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
    //or you can use
    //users = await User.find({},"name email");
    if (!users) {
      const error = new Error("no user finded");
      error.statusCode = 500;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation error");
    error.statusCode = 500;
    next(error);
  }
  const { name, email, password } = req.body;

  let findUser;
  try {
    findUser = await User.findOne({ email: email });
    if (findUser) {
      const error = new Error("email already exist");
      error.statusCode = 422;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  const hashedPwd = await bcrypt.hash(password, 12);
  const createdUser = new User({
    name, // name: name
    email,
    image: req.file.path,
    password: hashedPwd,
    places: [],
  });
  let signedupUser;

  try {
    signedupUser = await createdUser.save();
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  const token = jwt.sign(
    { userId: createdUser.id, email: createdUser.email },
    process.env.JSON_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );
  res.status(201).json({ user: signedupUser.toObject({ getters: true }), token });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation error");
    error.statusCode = 400;
    next(error);
  }
  const { email, password } = req.body;

  let findUser;
  try {
    findUser = await User.findOne({ email: email });
    const pwdIsTrue = await bcrypt.compare(password, findUser.password);
    if (!findUser || !pwdIsTrue) {
      const error = new Error(
        "some issus occurde, please check you email or password"
      );
      error.statusCode = 401;
      return next(error);
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    return next(err);
  }
  const token = jwt.sign(
    { userId: findUser.id, email: findUser.email },
    process.env.JSON_SECRET_KEY,
    {
      expiresIn: "1h",
    }
  );

  res.status(200).json({
    token,
    user: findUser.toObject({ getters: true }),
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
