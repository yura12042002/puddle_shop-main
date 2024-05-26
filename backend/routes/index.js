const Router = require("express")
const router = new Router()
const publicationRouter = require("./publicationRouter")
const userRouter = require("./userRouter")
const dogsRouter = require("./dogsRouter")

router.use("/user", userRouter) 
router.use("/dogs", dogsRouter)
router.use("/publicaton", publicationRouter)

module.exports = router