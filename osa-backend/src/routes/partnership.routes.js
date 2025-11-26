const express = require('express');
const router = express.Router();
const multer = require('multer');
const partnershipController = require('../controllers/partnership.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { partnershipValidation } = require('../middleware/validation');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  }
});

router.use(authenticateToken);

router.get('/', partnershipController.getAll);
router.get('/statistics', partnershipController.getStatistics);
router.get('/:id', partnershipController.getById);

router.post('/',
  authorizeRoles('admin', 'department'),
  upload.single('image'),
  partnershipValidation,
  partnershipController.create
);

router.put('/:id',
  authorizeRoles('admin', 'department'),
  upload.single('image'),
  partnershipValidation,
  partnershipController.update
);

router.delete('/:id',
  authorizeRoles('admin', 'department'),
  partnershipController.delete
);

module.exports = router;