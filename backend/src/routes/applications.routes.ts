import { Router } from 'express';
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/applications.controller';
import {
  createApplicationValidation,
  updateApplicationValidation,
} from '../middleware/validate';

const router = Router();

router.get('/', listApplications);
router.get('/:id', getApplication);
router.post('/', createApplicationValidation, createApplication);
router.patch('/:id', updateApplicationValidation, updateApplication);
router.delete('/:id', deleteApplication);

export default router;
