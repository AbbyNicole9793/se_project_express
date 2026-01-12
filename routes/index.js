const router = require("express").Router()


const userRouter = require("./users")
const clothingItemsRouter = require("./clothingItems")
const auth = require("../middlewares/auth")
const { login, createUser } = require("../controllers/users");

router.use("/users", auth, userRouter)

router.use("/items", auth, clothingItemsRouter)

router.post("/signup", createUser)
router.post("/signin", login)



module.exports = router