const User = require("../models/user")
const {error400, error404, error500} = require("../utils/errors")

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users)
      })
    .catch((err) => {
      console.error(err)
      if (err.name === "ValidationError") {
        error400(res)
      }
      error500(res)
    })

}

const getUser = (req, res) => {
  const {userId} = req.params
  User.findById(userId)
  .orFail()
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    console.error(err)
    if (err.name === "DocumentNotFoundError") {
      error404(res)
    } else if
      (err.name === "CastError") {
        error400(res)
      }
      error500(res)
  })
}

const createUser = (req, res) => {
  const { name, avatar} = req.body

  User.create({name, avatar})
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err)
      if (err.name === "ValidationError") {
        error400(res)
      }
      error500(res)
    })
}

module.exports = {getUsers, createUser, getUser}