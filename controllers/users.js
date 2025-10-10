const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND, SERVER_ERROR, CONFLICT_ERROR } = require("../utils/errors")
const { JWT_SECRET } = require("../utils/config")

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
      })
    .catch((err) => {
      console.error(err)
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    })

}

const getCurrentUser = (req, res) => {
  const {userId} = req.user._id
  User.findById(userId)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err)
    if (err.name === "DocumentNotFoundError") {
      return res.status(NOT_FOUND).send({ message: "User not found" })
    }
    if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Bad request" })
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
  })
}

const createUser = (req, res) => {
  const { name, avatar, email, password} = req.body

  User.findOne({ email })
    .then((matched) => {
      if (matched) {
        return res.status(CONFLICT_ERROR).send({ message: "Email is already in use."})
      }


      return bcrypt.hash(password, 10)
        .then(hash => User.create({name, avatar, email: email, password: hash}))
        .then((user) => {
          const newUser = user.toObject()
          delete newUser.password
          res.status(201).send(newUser) })
        .catch((err) => {
          console.error(err)
           if (err.code === 11000) {
        return res.status(CONFLICT_ERROR).send({ message: "Email already in use (DB level)" });
      }
          if (err.name === "ValidationError") {
           return res.status(BAD_REQUEST).send({ message: "An error has occurred on the server" })
          }
          return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
        })
        }
      )}


const login = (req, res) => {
  const { email, password } = req.body;


  return User.findUserByCredentials({email, password}).select("+password")
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });
     res.send({token})
    })
    .catch((err) => {
      console.error(err)
      res
        .status(UNAUTHORIZED)
        .send({ message: "Unauthorized user" });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid data" });
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" });
    });
};

module.exports = {getUsers, createUser, getCurrentUser, login, updateProfile}