const express = require("express");
const router = express.Router();
const DogsController = require("../controllers/dogsController");

router.post("/", DogsController.create);
router.get("/", DogsController.getAll);
router.get("/:id", DogsController.getOne);
router.delete("/:id", DogsController.deleteOne);
router.put("/:id", DogsController.editOne);

module.exports = router;