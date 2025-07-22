import express from 'express'
import { requireRole } from '../middlewares/requireRole'
import {adminCancelAppointment,  adminDeleteUser, adminFetchDoctors , adminFetchPatients, getAppointmentsByRole, adminRescheduleAppointment, getAdminDashboardStats} from '../controllers/adminControllers'
import { authMiddlewWare } from '../middlewares/authMiddleware';

const router = express.Router()

router.get('/doctors', authMiddlewWare, requireRole('ADMIN'), adminFetchDoctors);
router.get('/patients', authMiddlewWare, requireRole('ADMIN'), adminFetchPatients);
router.get("/dashboard-stats"  ,getAdminDashboardStats)
router.get('/appointments', authMiddlewWare, requireRole('ADMIN'), getAppointmentsByRole);
router.delete('/doctors/:userId', authMiddlewWare, requireRole('ADMIN'), adminDeleteUser);
router.patch('/doctors/:appointmentId/cancel' , authMiddlewWare , requireRole('ADMIN') , adminCancelAppointment)
router.patch('/doctors/:appointmentId/reschedule' , authMiddlewWare , requireRole('ADMIN') , adminRescheduleAppointment)


export default router;