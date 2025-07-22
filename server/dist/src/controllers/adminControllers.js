"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardStats = exports.adminFetchPatients = exports.adminRescheduleAppointment = exports.adminCancelAppointment = exports.getAppointmentsByRole = exports.adminDeleteUser = exports.adminFetchDoctors = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const adminFetchDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma.user.findMany({
            where: { role: "DOCTOR" },
            select: {
                id: true,
                name: true,
                role: true,
                speciality: true,
                image: true,
                createdAt: true,
                email: true,
                doctorAppointments: true,
                _count: true,
            },
        });
        res.status(200).json({ doctors });
    }
    catch (err) {
        console.error("Error fetching doctors:", err);
        res.json({ message: "Failed to fetch doctors" }, { status: 500 });
    }
});
exports.adminFetchDoctors = adminFetchDoctors;
const adminDeleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    if (!userId || typeof userId !== "string") {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        try {
            yield prisma.$transaction([
                prisma.message.deleteMany({
                    where: {
                        OR: [{ senderId: userId }, { receiverId: userId }],
                    },
                }),
                prisma.appointment.deleteMany({
                    where: {
                        OR: [{ doctorId: userId }, { patientId: userId }],
                    },
                }),
                prisma.user.delete({
                    where: { id: userId },
                }),
            ]);
            return res
                .status(200)
                .json({ message: "User and related data deleted successfully" });
        }
        catch (transactionError) {
            console.error("Transaction error:", transactionError.message, transactionError.stack);
            return res.status(500).json({
                message: "Deletion failed during transaction",
                error: transactionError.message,
            });
        }
    }
    catch (error) {
        console.error("Error deleting user:", error.message, error.stack);
        return res.status(500).json({
            message: "Failed to delete user",
            error: error.message,
        });
    }
});
exports.adminDeleteUser = adminDeleteUser;
const getAppointmentsByRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId, patientId } = req.query;
    try {
        const where = {};
        if (doctorId)
            where.doctorId = doctorId;
        if (patientId)
            where.patientId = patientId;
        const appointments = yield prisma.appointment.findMany({
            where,
            include: {
                patient: {
                    select: { id: true, name: true, email: true },
                },
                doctor: {
                    select: { id: true, name: true, email: true, speciality: true },
                },
            },
        });
        res.json(appointments);
    }
    catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to fetch appointments" });
    }
});
exports.getAppointmentsByRole = getAppointmentsByRole;
const adminCancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId } = req.params;
        const appointment = yield prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (appointment.status === "cancelled" ||
            appointment.status === "completed") {
            return res
                .status(400)
                .json({ message: `Cannot cancel a ${appointment.status} appointment` });
        }
        const cancelled = yield prisma.appointment.update({
            where: { id: appointmentId },
            data: { status: "cancelled" },
        });
        res.status(200).json({ message: "Appointment cancelled.", cancelled });
    }
    catch (err) {
        console.error("Error fetching appointment:", err);
        return res.status(500).json({ message: "Failed to Delete appointment" });
    }
});
exports.adminCancelAppointment = adminCancelAppointment;
const adminRescheduleAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { appointmentId } = req.params;
        const { newDate, newTime } = req.body;
        if (!newDate || !newTime) {
            return res.status(400).json({ message: "New date and time are required" });
        }
        const appointment = yield prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (appointment.status === "cancelled" || appointment.status === "completed") {
            return res.status(400).json({
                message: `Cannot reschedule a ${appointment.status} appointment`,
            });
        }
        const [hours, minutes] = newTime.split(":").map(Number);
        if (hours < 9 || (hours >= 17 && minutes > 0)) {
            return res.status(400).json({
                message: "Appointments allowed only between 09:00 A.M and 5:00 P.M",
            });
        }
        const [year, month, day] = newDate.split("-").map(Number);
        const combinedDate = new Date(year, month - 1, day, hours, minutes);
        if (isNaN(combinedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date or time format." });
        }
        const updated = yield prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                date: combinedDate,
                status: "upcoming",
            },
        });
        return res.status(200).json({
            message: "Appointment rescheduled",
            appointment: updated,
        });
    }
    catch (err) {
        console.error("Error rescheduling appointment:", err);
        return res.status(500).json({ message: "Failed to reschedule appointment" });
    }
});
exports.adminRescheduleAppointment = adminRescheduleAppointment;
const adminFetchPatients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield prisma.user.findMany({
            where: { role: "PATIENT" },
            select: {
                id: true,
                name: true,
                role: true,
                image: true,
                createdAt: true,
                email: true,
                _count: true,
                patientAppointments: true,
            },
        });
        res.status(200).json({ patients });
    }
    catch (err) {
        console.error("Error fetching patients:", err);
        res.json({ message: "Failed to fetch patients" }, { status: 500 });
    }
});
exports.adminFetchPatients = adminFetchPatients;
const getAdminDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const totalDoctors = yield prisma.user.count({
            where: { role: "DOCTOR" }
        });
        const totalAppointments = yield prisma.appointment.count();
        const newUsers = yield prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                }
            }
        });
        const activePatients = yield prisma.user.count({
            where: {
                role: "PATIENT",
            }
        });
        return res.json({
            totalDoctors,
            totalAppointments,
            newUsers,
            activePatients
        });
    }
    catch (error) {
        console.error("Error fetching admin stats:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAdminDashboardStats = getAdminDashboardStats;
