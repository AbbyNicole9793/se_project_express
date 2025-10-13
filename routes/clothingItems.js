const router = require("express").Router()
const { createItems, deleteItems, likeItem, dislikeItem, getItems} = require("../controllers/clothingItems")
const auth = require("../middlewares/auth")

router.get("/", getItems)

router.use(auth)

router.post("/", createItems)
router.delete("/:itemId", deleteItems)
router.put("/:itemId/likes", likeItem)
router.delete("/:itemId/likes", dislikeItem)



module.exports = router