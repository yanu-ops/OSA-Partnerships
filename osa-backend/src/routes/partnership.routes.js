const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnership.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { partnershipValidation } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', partnershipController.getAll);
router.get('/statistics', partnershipController.getStatistics);
router.get('/:id', partnershipController.getById);

router.post('/',
  authorizeRoles('admin', 'department'),
  partnershipValidation,
  partnershipController.create
);

router.put('/:id',
  authorizeRoles('admin', 'department'),
  partnershipValidation,
  partnershipController.update
);

router.delete('/:id',
  authorizeRoles('admin', 'department'),
  partnershipController.delete
);

module.exports = router;