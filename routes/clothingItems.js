const router = require("express").Router()
const { createItems, deleteItems, likeItem, dislikeItem} = require("../controllers/clothingItems")

router.post("/", createItems)
router.delete("/:itemId", deleteItems)
router.put("/:itemId/likes", likeItem)
router.delete("/:itemId/likes", dislikeItem)



module.exports = router