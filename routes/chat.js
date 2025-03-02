const router = require("express").Router();
const {
  getChats,
  getChat,
  putChat,
  deleteChat,
  postChat,
} = require("#controllers/chat_controller");
const message = require("./message");
const participant = require("./participant");

/**
 * Chats
 */

router.get("/", getChats);
router.get("/:id", getChat);
router.post("/", postChat);
router.put("/:id", putChat);
router.delete("/:id", deleteChat);

router.use("/:chatId/messages", message);
router.use("/:chatId/participants", participant);

module.exports = router;
