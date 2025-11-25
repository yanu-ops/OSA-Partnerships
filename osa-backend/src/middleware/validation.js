const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('../utils/errors');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg).join(', ');
    return next(new ValidationError(errorMessages));
  }
  next();
};

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

const registerValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain uppercase, lowercase, and number'),
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('role').isIn(['admin', 'department', 'viewer']).withMessage('Invalid role'),
  body('department')
    .if(body('role').equals('department'))
    .isIn(['STE', 'CET', 'CCJE', 'HousoCom', 'BSMT', 'SBME', 'CHATME'])
    .withMessage('Valid department is required for department role'),
  validate
];

const partnershipValidation = [
  body('business_name').trim().notEmpty().withMessage('Business name is required'),
  body('department')
    .isIn(['STE', 'CET', 'CCJE', 'HousoCom', 'BSMT', 'SBME', 'CHATME'])
    .withMessage('Valid department is required'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('contact_person').trim().notEmpty().withMessage('Contact person is required'),
  body('manager_supervisor_1').trim().notEmpty().withMessage('At least one manager/supervisor is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('contact_number').trim().notEmpty().withMessage('Contact number is required'),
  body('date_established').isDate().withMessage('Valid establishment date is required'),
  body('expiration_date').isDate().withMessage('Valid expiration date is required'),
  body('status')
    .isIn(['active', 'terminated', 'for_renewal', 'non_renewal'])
    .withMessage('Invalid status'),
  validate
];

module.exports = {
  loginValidation,
  registerValidation,
  partnershipValidation,
  validate
};