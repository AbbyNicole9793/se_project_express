const Item = require("../models/clothingItem")
const {error400, error404, error500} = require("../utils/errors")



const getItems = (req, res) => {
  Item.find({})
    .then((items) => {
      res.send(items)
    })
    .catch((err) => {
      console.error(err)
      return error500(res, err)
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
        return error400(res, err)
      }
      return error500(res, err)
    })
}

const deleteItems = (req, res) => {
  const { ItemId } = req.params
  Item.findByIdAndDelete(ItemId)
  .orFail()
  .then((item) => res.status(200).send(item))
  .catch((err) => {
    console.error(err)
    if (err.name === "DocumentNotFoundError") {
      return error404(res, err)
    } else if
      (err.name === "CastError") {
        return error400(res, err)
      }
      return error500(res, err)
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
      if (err.message === "DocumentNotFoundError") {
        return error404(res, err);
      }
      if (err.name === "CastError") {
        return error400(res, err);
      }
      return error500(res, err);
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
      if (err.message === "DocumentNotFoundError") {
        return error404(res, err);
      }
      if (err.name === "CastError") {
        return error400(res, err);
      }
      return error500(res, err);
    });


module.exports = {getItems, createItems, deleteItems, likeItem, dislikeItem}
