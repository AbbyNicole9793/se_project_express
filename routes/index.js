const router = require("express").Router()


const userRouter = require("./users")
const clothingItemsRouter = require("./clothingItems")
const auth = require("../middlewares/auth")
const { login, createUser } = require("../controllers/users");
const { validateCreateUser, validateLogin } = require("../middlewares/validation");


router.use("/users", userRouter)

router.use("/items", auth, clothingItemsRouter)

router.post("/signup", validateCreateUser, createUser)
router.post("/signin", validateLogin, login)



module.exports = router