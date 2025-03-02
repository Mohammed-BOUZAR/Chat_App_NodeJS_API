const router = require("express").Router();
const {
  getParticipants,
  getParticipant,
  putParticipant,
  deleteParticipant,
  postParticipant,
} = require("#controllers/participant_controller");

/**
 * Participants
 */

router.get("/", getParticipants);
router.get("/:id", getParticipant);
router.post("/", postParticipant);
router.put("/:id", putParticipant);
router.delete("/:id", deleteParticipant);

module.exports = router;
