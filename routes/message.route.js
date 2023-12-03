const MessageController = require("../controllers/message.controller");

const router = require("express").Router();

router.get("/:id", MessageController.getOne);
router.get("/t/:id", MessageController.getGroupMessages);
router.post("/t/:id", MessageController.chat);

module.exports = router;