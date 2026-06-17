import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

const JOB_TYPES = ['Internship', 'Full-time', 'Part-time'] as const;
const STATUSES = ['Applied', 'Interviewing', 'Offer', 'Rejected'] as const;

export const createApplicationValidation = [
  body('company_name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
  body('job_title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required'),
  body('job_type')
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}`),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('applied_date')
    .isISO8601()
    .withMessage('Applied date must be a valid date (YYYY-MM-DD)'),
  body('notes')
    .optional()
    .isString(),
  handleValidationErrors,
];

export const updateApplicationValidation = [
  body('company_name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Company name must be at least 2 characters'),
  body('job_title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Job title cannot be empty'),
  body('job_type')
    .optional()
    .isIn(JOB_TYPES)
    .withMessage(`Job type must be one of: ${JOB_TYPES.join(', ')}`),
  body('status')
    .optional()
    .isIn(STATUSES)
    .withMessage(`Status must be one of: ${STATUSES.join(', ')}`),
  body('applied_date')
    .optional()
    .isISO8601()
    .withMessage('Applied date must be a valid date (YYYY-MM-DD)'),
  body('notes')
    .optional()
    .isString(),
  handleValidationErrors,
];
