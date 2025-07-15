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
exports.updateAppointmentStatus = exports.rescheduleAppointment = exports.cancelAppointment = exports.getAppointmentsByPatientId = exports.getDrAppointments = exports.getMyAppointments = exports.bookAppointment = exports.createAppointment = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { doctorId, date } = req.body;
        const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!doctorId || !date) {
            return res
                .status(400)
                .json({ message: "Doctor ID and Date are required" });
        }
        const appointment = yield prisma.appointment.create({
            data: {
                patientId,
                doctorId,
                date: new Date(date),
            },
        });
        res.status(201).json(appointment);
    }
    catch (err) {
        console.error("Create Appointment Error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createAppointment = createAppointment;
const bookAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { doctorId, datetime } = req.body;
        const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!doctorId || !datetime) {
            return res.status(400).json({ message: "Doctor ID and datetime are required." });
        }
        const combinedDateTime = new Date(datetime);
        if (isNaN(combinedDateTime.getTime())) {
            return res.status(400).json({ message: "Invalid datetime format." });
        }
        const hours = combinedDateTime.getHours();
        const minutes = combinedDateTime.getMinutes();
        if (hours < 9 || (hours >= 17 && minutes > 0)) {
            return res.status(400).json({ message: "Appointments allowed only between 09:00 A.M and 5:00 P.M" });
        }
        const doctor = yield prisma.user.findUnique({ where: { id: doctorId } });
        if (!doctor || doctor.role !== "DOCTOR") {
            return res.status(404).json({ message: "Doctor not found or invalid role." });
        }
        const appointment = yield prisma.appointment.create({
            data: {
                doctorId,
                patientId,
                date: combinedDateTime,
            },
        });
        return res.status(201).json({
            message: "Appointment booked successfully!",
            appointment,
        });
    }
    catch (error) {
        console.error("Booking Error:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
});
exports.bookAppointment = bookAppointment;
const getMyAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const patientId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const appointments = yield prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "asc" },
        });
        res.status(200).json({ appointments });
    }
    catch (err) {
        console.error("Error fetching patient appointments:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getMyAppointments = getMyAppointments;
const getDrAppointments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const doctorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const appointments = yield prisma.appointment.findMany({
            where: { doctorId },
            include: {
                patient: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "asc" },
        });
        res.status(200).json({ appointments });
    }
    catch (err) {
        console.error("Error fetching doctor appointments:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getDrAppointments = getDrAppointments;
const getAppointmentsByPatientId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { patientId } = req.params;
        console.log("Requested Patient ID:", patientId);
        const appointments = yield prisma.appointment.findMany({
            where: { patientId },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: { date: "asc" },
        });
        res.status(200).json({ appointments });
    }
    catch (err) {
        console.error("Error fetching patient appointments:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getAppointmentsByPatientId = getAppointmentsByPatientId;
const cancelAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentId = req.params.appointmentId;
        const patientId = req.user.id;
        const appointment = yield prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment || appointment.patientId !== patientId) {
            return res.status(403).json({ message: "Unauthorized or not found." });
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
        console.error("Cancel Appointment Error:", err);
        res.status(500).json({ message: "Server error." });
    }
});
exports.cancelAppointment = cancelAppointment;
const rescheduleAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const appointmentId = req.params.appointmentId;
        const { newDate, newTime } = req.body;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: Missing user" });
        }
        const patientId = req.user.id;
        const appointment = yield prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment || appointment.patientId !== patientId) {
            return res.status(403).json({ message: "Unauthorized or not found." });
        }
        if (appointment.status === "cancelled" ||
            appointment.status === "completed") {
            return res.status(400).json({
                message: `Cannot reschedule a ${appointment.status} appointment`,
            });
        }
        if (!newDate || !newTime) {
            return res
                .status(400)
                .json({ message: "New date and time are required" });
        }
        const [hours, minutes] = newTime.split(":").map(Number);
        const combinedDate = new Date(newDate);
        combinedDate.setHours(hours, minutes, 0, 0); // Set time to the date
        if (isNaN(combinedDate.getTime())) {
            return res.status(400).json({ message: "Invalid date or time format." });
        }
        if (hours < 9 || (hours >= 17 && minutes > 0)) {
            return res.status(400).json({
                message: "Appointments allowed only between 09:00 A.M and 5.00 P.M",
            });
        }
        const updated = yield prisma.appointment.update({
            where: { id: appointmentId },
            data: {
                date: combinedDate,
                status: "upcoming",
            },
        });
        return res
            .status(200)
            .json({ message: "Appointment rescheduled", appointment: updated });
    }
    catch (err) {
        console.error("Error in rescheduleAppointment:", err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.rescheduleAppointment = rescheduleAppointment;
const updateAppointmentStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const drId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const { appointmentId } = req.params;
        const { status, newDate, newTime } = req.body;
        const validStatuses = ["approved", "cancelled", "upcoming"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const appointment = yield prisma.appointment.findUnique({
            where: { id: appointmentId },
        });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (appointment.doctorId !== drId) {
            return res.status(403).json({ message: "Unauthorized action" });
        }
        if (["cancelled", "completed"].includes(appointment.status)) {
            return res.status(400).json({ message: `Cannot update a ${appointment.status} appointment` });
        }
        const updateData = { status };
        if (status === "upcoming") {
            if (typeof newDate !== "string" || typeof newTime !== "string") {
                return res.status(400).json({ message: "Reschedule requires new date and time" });
            }
            const combinedDateTime = new Date(`${newDate}T${newTime}`);
            if (isNaN(combinedDateTime.getTime())) {
                return res.status(400).json({ message: "Invalid date or time format." });
            }
            const hours = combinedDateTime.getHours();
            const minutes = combinedDateTime.getMinutes();
            if (hours < 9 || (hours >= 17 && minutes > 0)) {
                return res
                    .status(400)
                    .json({ message: "Appointments allowed only between 09:00 A.M and 5:00 P.M" });
            }
            updateData.date = combinedDateTime;
        }
        const updated = yield prisma.appointment.update({
            where: { id: appointmentId },
            data: updateData,
        });
        res.status(200).json({ message: "Appointment updated", appointment: updated });
    }
    catch (err) {
        console.error("Update appointment status error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.updateAppointmentStatus = updateAppointmentStatus;
