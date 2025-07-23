import express from "express";
import {
  bookAppointment,
  getMyAppointments,
  getDrAppointments,
  getAppointmentsByPatientId,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { authMiddlewWare } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/requireRole";

const router = express.Router();

router.post("/book", authMiddlewWare, requireRole("PATIENT"), bookAppointment);
// router.post("/", authMiddlewWare, requireRole("PATIENT"), createAppointment);
router.get("/mine", authMiddlewWare, requireRole("PATIENT"), getMyAppointments);
router.get("/doctor", authMiddlewWare, requireRole("DOCTOR"), getDrAppointments)
router.get("/patient/:patientId", authMiddlewWare, requireRole("DOCTOR"), getAppointmentsByPatientId)
router.patch(
  "/cancel/:appointmentId",
  authMiddlewWare,
  requireRole("PATIENT"),
  cancelAppointment
);
router.patch(
  "/reschedule/:appointmentId",
  authMiddlewWare,
  requireRole("PATIENT"),
  rescheduleAppointment
);
router.patch(
  "/doctor/:appointmentId",
  authMiddlewWare,
  requireRole("DOCTOR"),
  updateAppointmentStatus
);

export default router;
