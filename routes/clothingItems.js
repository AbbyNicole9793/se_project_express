const router = require("express").Router()
const { createItems, deleteItems, likeItem, dislikeItem, getItems} = require("../controllers/clothingItems")
const auth = require("../middlewares/auth")
const { validateCreateItem, validateObjectId} = require("../middlewares/validation")

router.get("/", getItems)

router.use(auth)

router.post("/", validateCreateItem, createItems)
router.delete("/:itemId", validateObjectId, deleteItems)
router.put("/:itemId/likes", validateObjectId, likeItem)
router.delete("/:itemId/likes", validateObjectId, dislikeItem)



module.exports = router