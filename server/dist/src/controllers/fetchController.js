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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.fetchDoctors = exports.specality = exports.uploadImage = exports.changePassword = exports.updateuserProfile = exports.getuserProfile = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const cloudinary_1 = __importDefault(require("../../utils/cloudinary"));
const getuserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const details = yield prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                createdAt: true,
            },
        });
        if (!details) {
            return res.status(404).json({ message: "user not found" });
        }
        res.json({ details });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch user profile" });
    }
});
exports.getuserProfile = getuserProfile;
const updateuserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { name, email, speciality } = req.body;
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const dataToUpdate = { name, email };
        if (user.role === "DOCTOR" && speciality) {
            dataToUpdate.speciality = speciality;
        }
        const updated = yield prisma.user.update({
            where: { id: userId },
            data: dataToUpdate,
        });
        res.json({ message: "Profile updated successfully", profile: updated });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update profile" });
    }
});
exports.updateuserProfile = updateuserProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res
                .status(400)
                .json({ message: "Both current and new passwords are required" });
        }
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Current password is incorrect" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        return res.status(200).json({ message: "Password updated successfully" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.changePassword = changePassword;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const fileBuffer = (_b = req.file) === null || _b === void 0 ? void 0 : _b.buffer;
        const fileType = (_c = req.file) === null || _c === void 0 ? void 0 : _c.mimetype;
        if (!fileBuffer || !fileType) {
            res.status(400).json({ message: "No image uploaded" });
        }
        const cloudinaryResponse = yield cloudinary_1.default.uploader.upload(`data:${fileType};base64,${fileBuffer.toString("base64")}`, { folder: "user-profiles" });
        const imageUrl = cloudinaryResponse.secure_url;
        yield prisma.user.update({
            where: { id: userId },
            data: { image: imageUrl },
        });
        return res.json({ message: "Image uploaded", image: imageUrl });
    }
    catch (err) {
        console.error("Upload failed:", err);
        res.status(500).json({ message: "Failed to upload image" });
    }
});
exports.uploadImage = uploadImage;
const specality = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const specalities = [
            { id: 1, name: "Cardiology" },
            { id: 2, name: "Dermatology" },
            { id: 3, name: "Endocrinology" },
            { id: 4, name: "Gastroenterology" },
            { id: 5, name: "Nephrology" },
            { id: 6, name: "Neurology" },
            { id: 7, name: "Oncology" },
            { id: 8, name: "Ophthalmology" },
            { id: 9, name: "Orthopedics" },
            { id: 10, name: "Pediatrics" },
            { id: 11, name: "Psychiatry" },
            { id: 12, name: "Pulmonology" },
            { id: 13, name: "Rheumatology" },
            { id: 14, name: "Urology" },
            { id: 15, name: "Gynecology" },
            { id: 16, name: "General Surgery" },
            { id: 17, name: "ENT (Otolaryngology)" },
            { id: 18, name: "Hematology" },
            { id: 19, name: "Allergy & Immunology" },
            { id: 20, name: "Family Medicine" },
        ];
        res.status(200).json({ specality: specalities });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.specality = specality;
const fetchDoctors = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctors = yield prisma.user.findMany({
            where: { role: "DOCTOR" },
            select: {
                id: true,
                name: true,
                role: true,
                speciality: true,
                image: true,
                schedules: {
                    select: {
                        day: true,
                        startTime: true,
                        endTime: true,
                    },
                },
            },
        });
        res.status(200).json({ doctors });
    }
    catch (err) {
        console.error("Error fetching doctors:", err);
        res.status(500).json({ message: "Failed to fetch doctors" });
    }
});
exports.fetchDoctors = fetchDoctors;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.getUserById = getUserById;
