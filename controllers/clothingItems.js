const mongoose = require("mongoose")
const Item = require("../models/clothingItem")
const BadRequestError = require("../utils/errors/BadRequestError")
const NotFoundError = require("../utils/errors/NotFoundError")
const UnauthorizedError = require("../utils/errors/UnauthorizedError")
const ForbiddenError = require("../utils/errors/ForbiddenError")



const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => {
      res.send(items)
    })
    .catch(next)
}

const createItems = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user?._id;

  if (!userId) {
    return next(new UnauthorizedError("User not authorized"));
  }

  Item.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid item data"));
      }

      return next(err);
    });
};

const deleteItems = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid item ID format"));
  }

  Item.findById(itemId)
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return next(new ForbiddenError("You are not allowed to delete this item"));
      }

      return item.deleteOne().then(() => {
        res.status(200).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};


const dislikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new NotFoundError("Item not found"))
    .then((item) => res.send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid item ID format"));
      }
      return next(err);
    });
};

module.exports = { getItems, createItems, deleteItems, likeItem, dislikeItem }
