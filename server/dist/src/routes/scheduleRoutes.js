"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schedules_1 = require("../controllers/schedules");
const router = express_1.default.Router();
router.get('/:doctorId', schedules_1.getDoctorAvailability);
router.post('/', schedules_1.createAvailability);
router.put('/:id', schedules_1.updateAvailability);
router.delete('/:id', schedules_1.deleteAvailability);
exports.default = router;
