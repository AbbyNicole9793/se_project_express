const router = require("express").Router()
const { getItems, createItems, deleteItems, likeItem, dislikeItem} = require("../controllers/clothingItems")
const auth = require("../middlewares/auth")

router.get("/", auth, getItems)
router.post("/", createItems)
router.delete("/:itemId", deleteItems)
router.put("/:itemId/likes", likeItem)
router.delete("/:itemId/likes", dislikeItem)



module.exports = router