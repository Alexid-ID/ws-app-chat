const GroupController = require('../controllers/group.controller');
const router = require('express').Router();


router.get('/', GroupController.getAll);
router.get('/:id', GroupController.getOne);
router.post('/', GroupController.create);
// router.put('/:id', GroupController.update);
router.delete('/:id', GroupController.delete);

// members: array of user id
router.post('/:id/members', GroupController.addMember);
// a user leave a group
router.post('/leave', GroupController.leaveGroup);

module.exports = router;