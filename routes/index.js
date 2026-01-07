const router = require("express").Router()


const userRouter = require("./users")
const clothingItemsRouter = require("./clothingItems")
const auth = require("../middlewares/auth")
const { validateCreateUser, validateCreateItem} = require("../middlewares/validation")

router.use("/users", auth, validateCreateUser, userRouter)

router.use("/items", auth, validateCreateItem, clothingItemsRouter)


module.exports = router