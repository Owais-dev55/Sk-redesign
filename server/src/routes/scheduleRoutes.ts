import express from 'express';
import {createAvailability,getDoctorAvailability,deleteAvailability,updateAvailability,} from '../controllers/schedules';

const router = express.Router();

router.get('/:doctorId', getDoctorAvailability);
router.post('/', createAvailability);
router.put('/:id', updateAvailability);
router.delete('/:id', deleteAvailability);

export default router;
