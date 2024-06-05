const router = require('express').Router();
const { getUsers, getUser, putUser, deleteUser, postUser } = require('#controllers/user_controller')

/**
 * Users
 */

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', postUser);
router.put('/:id', putUser);
router.delete('/:id', deleteUser);

module.exports = router;