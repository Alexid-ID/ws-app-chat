const MessageController = require("../controllers/message.controller");

const router = require("express").Router();

router.get("/:id", MessageController.getOne);
router.post("/:id/chat", MessageController.chat);

module.exports = router;