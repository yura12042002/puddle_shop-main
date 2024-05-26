const Router = require("express");
const { registration, login, check } = require("../controllers/userController");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/registration", registration);
router.post("/login", login);
router.get("/check", authMiddleware, check);

module.exports = router;
