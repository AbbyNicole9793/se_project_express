const mongoose = require("mongoose")
const Item = require("../models/clothingItem")
const {BAD_REQUEST, NOT_FOUND, SERVER_ERROR, UNAUTHORIZED_USER} = require("../utils/errors")


const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items)
    })
    .catch((err) => {
      console.error(err)
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    })
}

const createItems = (req, res) => {
  console.log(req.user._id)
  const { name, weather, imageUrl } = req.body
  const userId = req.user._id

  Item.create({name, weather, imageUrl, owner: userId})
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err)
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "An error has occurred on the server" })
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    })
}

const deleteItems = (req, res) => {
  const { itemId } = req.params
  const userId = req.user._id

 if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid item ID format" });
  }

  Item.findById(itemId)
  .orFail()
  .then((item) => {
    if (item.owner.toString() !== userId) {
      return res.status(UNAUTHORIZED_USER).send({ message: "You are not authorized to delete this item"})
    }

    return Item.deleteOne({ _id: itemId })
      .then(() => res.status(200).send({message: "Item deleted successfuly"}))
      .catch((err) => {
       console.error(err)
       if (err instanceof mongoose.Error.DocumentNotFoundError) {
          return res.status(NOT_FOUND).send({ message: "An error has occurred on the server" })
        }
        if (err.name === "CastError") {
           return res.status(BAD_REQUEST).send({ message: "An error has occurred on the server" })
          }
         return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
      })
    })
}

const likeItem = (req, res) => Item.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: "An error has occurred on the server" })
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "An error has occurred on the server" })
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    });


const dislikeItem = (req, res) => Item.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: "An error has occurred on the server" })
      }
      if (err.name === "CastError") {
       return res.status(BAD_REQUEST).send({ message: "An error has occurred on the server" })
      }
      return res.status(SERVER_ERROR).send({ message: "An error has occurred on the server" })
    });


module.exports = {getItems, createItems, deleteItems, likeItem, dislikeItem}
