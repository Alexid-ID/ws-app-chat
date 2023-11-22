const GroupController = require('../controllers/group.controller');
const router = require('express').Router();


router.get('/', GroupController.getAll);
router.get('/:id', GroupController.getOne);
router.post('/', GroupController.create);
router.put('/:id', GroupController.update);
router.delete('/:id', GroupController.delete);


module.exports = router;