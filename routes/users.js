const router = require("express").Router()
const { getCurrentUser, updateProfile } = require("../controllers/users")
const auth = require("../middlewares/auth")
const { validateLogin } = require("../middlewares/validation")



router.get("/me", auth, validateLogin, getCurrentUser)
router.patch("/me", auth, updateProfile)

module.exports = router