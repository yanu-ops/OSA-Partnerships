const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { registerValidation } = require('../middleware/validation');

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

router.get('/users', adminController.getAllUsers);
router.post('/users', registerValidation, adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.get('/audit-logs', adminController.getAuditLogs);
router.get('/dashboard-stats', adminController.getDashboardStats);

module.exports = router;