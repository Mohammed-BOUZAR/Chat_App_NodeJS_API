const router = require('express').Router({ mergeParams: true});
const { getMessages, getMessage, putMessage, deleteMessage, postMessage } = require('#controllers/message_controller')

/**
 * Messages
 */

router.get('/', getMessages);
router.get('/:id', getMessage);
router.post('/', postMessage);
router.put('/:id', putMessage);
router.delete('/:id', deleteMessage);

module.exports = router;