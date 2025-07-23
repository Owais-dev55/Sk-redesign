"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appointmentController_1 = require("../controllers/appointmentController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const requireRole_1 = require("../middlewares/requireRole");
const router = express_1.default.Router();
router.post("/book", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("PATIENT"), appointmentController_1.bookAppointment);
// router.post("/", authMiddlewWare, requireRole("PATIENT"), createAppointment);
router.get("/mine", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("PATIENT"), appointmentController_1.getMyAppointments);
router.get("/doctor", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("DOCTOR"), appointmentController_1.getDrAppointments);
router.get("/patient/:patientId", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("DOCTOR"), appointmentController_1.getAppointmentsByPatientId);
router.patch("/cancel/:appointmentId", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("PATIENT"), appointmentController_1.cancelAppointment);
router.patch("/reschedule/:appointmentId", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("PATIENT"), appointmentController_1.rescheduleAppointment);
router.patch("/doctor/:appointmentId", authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)("DOCTOR"), appointmentController_1.updateAppointmentStatus);
exports.default = router;
