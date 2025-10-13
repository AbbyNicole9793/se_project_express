const router = require("express").Router()


const userRouter = require("./users")
const clothingItemsRouter = require("./clothingItems")
const auth = require("../middlewares/auth")

router.use("/users", auth, userRouter)

router.use("/items", auth, clothingItemsRouter)


module.exports = router