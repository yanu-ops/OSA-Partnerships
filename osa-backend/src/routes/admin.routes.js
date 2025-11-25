const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { registerValidation } = require('../middleware/validation');
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/users', adminController.getAllUsers);
router.post('/users', registerValidation, adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/change-password', 
  [
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('New password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain uppercase, lowercase, and number'),
    validate
  ],
  adminController.changeUserPassword
);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;