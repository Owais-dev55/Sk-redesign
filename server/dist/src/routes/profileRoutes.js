"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const fetchController_1 = require("../controllers/fetchController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const router = express_1.default.Router();
router.get("/profile", authMiddleware_1.authMiddlewWare, fetchController_1.getuserProfile);
router.put("/profile", authMiddleware_1.authMiddlewWare, fetchController_1.updateuserProfile);
router.put("/change-password", authMiddleware_1.authMiddlewWare, fetchController_1.changePassword);
router.post('/profile/upload', authMiddleware_1.authMiddlewWare, upload.single("image"), fetchController_1.uploadImage);
router.get('/doctors', fetchController_1.fetchDoctors);
router.get('/specality', fetchController_1.specality);
exports.default = router;
