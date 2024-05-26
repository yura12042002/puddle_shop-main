const Router = require("express")
const { create, getAll, getOne, deleteOne, editOne } = require("../controllers/publicationController")
const router = new Router()

router.post("/",create)
router.get("/",getAll)
router.get("/:id",getOne)
router.delete("/:id", deleteOne)
router.put("/:id", editOne)

module.exports = router
