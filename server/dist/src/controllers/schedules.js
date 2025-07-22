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
exports.updateAvailability = exports.deleteAvailability = exports.getDoctorAvailability = exports.createAvailability = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { doctorId, day, startTime, endTime } = req.body;
        if (!doctorId || !day || !startTime || !endTime) {
            return res.status(400).json({ message: "All fields are required." });
        }
        const [startHour, startMin] = startTime.split(":").map(Number);
        const [endHour, endMin] = endTime.split(":").map(Number);
        if (startHour < 9 || endHour > 17 || startHour >= endHour) {
            return res.status(400).json({
                message: "Time must be between 09:00 A.M and 5:00 P.M.",
            });
        }
        if (startMin !== 0 || endMin !== 0) {
            return res.status(400).json({
                message: "Time must be on the hour (e.g., 09:00, 10:00). No partial minutes allowed.",
            });
        }
        const existing = yield prisma.schedule.findFirst({
            where: { doctorId, day },
        });
        if (existing) {
            return res
                .status(409)
                .json({ message: "Schedule for this day already exists." });
        }
        const availability = yield prisma.schedule.create({
            data: {
                day,
                startTime,
                endTime,
                doctor: {
                    connect: { id: doctorId },
                },
            },
        });
        res.status(201).json(availability);
    }
    catch (error) {
        console.error("Error creating availability:", error);
        res.status(500).json({ message: "Server error creating availability." });
    }
});
exports.createAvailability = createAvailability;
const getDoctorAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { doctorId } = req.params;
    try {
        const availability = yield prisma.schedule.findMany({
            where: { doctorId },
            orderBy: { day: "asc" },
        });
        res.status(200).json(availability);
    }
    catch (error) {
        console.error("Error fetching availability:", error);
        res.status(500).json({ message: "Server error fetching availability." });
    }
});
exports.getDoctorAvailability = getDoctorAvailability;
const deleteAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleted = yield prisma.schedule.delete({
            where: { id },
        });
        res
            .status(200)
            .json({ message: "Schedule deleted successfully.", deleted });
    }
    catch (error) {
        console.error("Error deleting schedule:", error);
        res.status(500).json({ message: "Server error deleting schedule." });
    }
});
exports.deleteAvailability = deleteAvailability;
const updateAvailability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;
    try {
        const updated = yield prisma.schedule.update({
            where: { id },
            data: { startTime, endTime, day },
        });
        res.status(200).json(updated);
    }
    catch (error) {
        console.error("Error updating schedule:", error);
        res.status(500).json({ message: "Server error updating schedule." });
    }
});
exports.updateAvailability = updateAvailability;
