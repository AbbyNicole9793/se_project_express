const Item = require("../models/clothingItem")
const {error400, error404, error500} = require("../utils/errors")



const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items)
    })
    .catch((err) => {
      console.error(err)
      error500(res)
    })
}

const createItems = (req, res) => {
  console.log(req.user._id)
  const { name, weather, imageUrl} = req.body
  const userId = req.user._id

  Item.create({name, weather, imageUrl, owner: userId})
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err)
      if (err.name === "ValidationError") {
        error400(res)
      }
      error500(res)
    })
}

const deleteItems = (req, res) => {
  const {objectId} = req.params
  Item.findByIdAndDelete(objectId)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err)
    if (err.name === "NotFound") {
      error404(res)
    } else if
      (err.name === "CastError") {
        error400(res)
      }
      error500(res)
  })
}

const likeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.message === "NotFound") {
        return error404(res);
      }
      if (err.name === "CastError") {
        return error400(res);
      }
      return error500(res);
    });


const dislikeItem = (req, res) => ClothingItem.findByIdAndUpdate(
  req.params.itemId,
  { $pull: { likes: req.user._id } },
  { new: true },
)
  .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.message === "NotFound") {
        return error404(res);
      }
      if (err.name === "CastError") {
        return error400(res);
      }
      return error500(res);
    });


module.exports = {getItems, createItems, deleteItems, likeItem, dislikeItem}
