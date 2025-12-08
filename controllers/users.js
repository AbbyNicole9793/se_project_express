const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const User = require("../models/user")
const { JWT_SECRET } = require("../utils/config")
const BadRequestError = require("../utils/errors/BadRequestError")
const NotFoundError = require("../utils/errors/NotFoundError")
const UnauthorizedError = require("../utils/errors/UnauthorizedError")
const ConflictError = require("../utils/errors/ConflictError")

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail(() => new NotFoundError("User not found"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, avatar } = req.body;

  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return next(new ConflictError("Email is already in use"));
      }

      return bcrypt.hash(password, 10)
        .then((hash) =>
          User.create({
            email,
            password: hash,
            name,
            avatar,
          })
        )
        .then((user) => {
          const newUser = user.toObject();
          delete newUser.password;
          return res.status(201).send(newUser);
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("Email already in use (DB level)"));
      }

      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }

      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
      res.send({ token });
    })
    .catch(() => {

      next(new UnauthorizedError("Invalid email or password"));
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid profile data"));
      }
      return next(err);
    });
};

module.exports = {createUser, getCurrentUser, login, updateProfile}