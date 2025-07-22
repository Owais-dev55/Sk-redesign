"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requireRole_1 = require("../middlewares/requireRole");
const adminControllers_1 = require("../controllers/adminControllers");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/doctors', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.adminFetchDoctors);
router.get('/patients', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.adminFetchPatients);
router.get("/dashboard-stats", adminControllers_1.getAdminDashboardStats);
router.get('/appointments', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.getAppointmentsByRole);
router.delete('/doctors/:userId', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.adminDeleteUser);
router.patch('/doctors/:appointmentId/cancel', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.adminCancelAppointment);
router.patch('/doctors/:appointmentId/reschedule', authMiddleware_1.authMiddlewWare, (0, requireRole_1.requireRole)('ADMIN'), adminControllers_1.adminRescheduleAppointment);
exports.default = router;
